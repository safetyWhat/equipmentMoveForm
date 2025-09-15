const { app } = require('@azure/functions');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { getCorsHeaders, verifyJWT } = require('../utils/authMiddleware');

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 12;

app.http('updateUser', {
    methods: ['PUT', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Update user request received');
        
        // Handle CORS preflight request
        if (request.method === 'OPTIONS') {
            return {
                status: 200,
                headers: getCorsHeaders()
            };
        }

        try {
            // Verify admin authentication
            const authResult = await verifyJWT(request, context);
            if (!authResult.success) {
                return {
                    status: authResult.status,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: authResult.error })
                };
            }

            // Check if user is admin
            const adminUser = await prisma.user.findUnique({
                where: { id: authResult.userId }
            });

            if (!adminUser || adminUser.type !== 'admin') {
                return {
                    status: 403,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Access denied. Admin privileges required.' })
                };
            }

            // Parse request body
            let requestData;
            try {
                const rawBody = await request.text();
                requestData = JSON.parse(rawBody);
            } catch (parseError) {
                context.log.error('Failed to parse request body:', parseError);
                return {
                    status: 400,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Invalid JSON in request body' })
                };
            }

            const { userId, username, name, type, password } = requestData;

            // Validation
            if (!userId) {
                return {
                    status: 400,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'User ID is required' })
                };
            }

            // Check if user exists
            const existingUser = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!existingUser) {
                return {
                    status: 404,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'User not found' })
                };
            }

            // Prepare update data
            const updateData = {};

            if (username && username !== existingUser.username) {
                // username format validation
                const usernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!usernameRegex.test(username)) {
                    return {
                        status: 400,
                        headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                        body: JSON.stringify({ error: 'Invalid username format' })
                    };
                }

                // Check if username is already taken
                const usernameExists = await prisma.user.findUnique({
                    where: { username: username.toLowerCase() }
                });

                if (usernameExists && usernameExists.id !== userId) {
                    return {
                        status: 409,
                        headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                        body: JSON.stringify({ error: 'username is already taken by another user' })
                    };
                }

                updateData.username = username.toLowerCase();
            }

            if (name && name.trim() !== existingUser.name) {
                updateData.name = name.trim();
            }

            if (type && ['user', 'admin'].includes(type) && type !== existingUser.type) {
                updateData.type = type;
            }

            if (password) {
                // Password strength validation
                if (password.length < 6) {
                    return {
                        status: 400,
                        headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                        body: JSON.stringify({ error: 'Password must be at least 6 characters long' })
                    };
                }
                updateData.password = await bcrypt.hash(password, BCRYPT_ROUNDS);
            }

            // If no changes, return early
            if (Object.keys(updateData).length === 0) {
                return {
                    status: 200,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        success: true,
                        message: 'No changes detected',
                        user: {
                            id: existingUser.id,
                            username: existingUser.username,
                            name: existingUser.name,
                            type: existingUser.type,
                            createdAt: existingUser.createdAt,
                            updatedAt: existingUser.updatedAt
                        }
                    })
                };
            }

            // Update user
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: updateData,
                select: {
                    id: true,
                    username: true,
                    name: true,
                    type: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            context.log(`User updated successfully by admin: ${updatedUser.username} (admin: ${adminUser.username})`);

            return {
                status: 200,
                headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: true,
                    message: 'User updated successfully',
                    user: updatedUser
                })
            };

        } catch (error) {
            context.log.error('Update user error:', error);
            
            // Handle Prisma-specific errors
            if (error.code === 'P2002') {
                return {
                    status: 409,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'username is already taken by another user' })
                };
            }
            
            return {
                status: 500,
                headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'Internal server error',
                    message: 'Failed to update user. Please try again.',
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined
                })
            };
        } finally {
            await prisma.$disconnect();
        }
    }
});
