const { app } = require('@azure/functions');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { generateToken, getCorsHeaders, verifyJWT } = require('../utils/authMiddleware');

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 12;

app.http('register', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Admin user registration request received');
        
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

            const { email, password, name, type = 'user' } = requestData;

            // Validation
            if (!email || !password || !name) {
                return {
                    status: 400,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        error: 'Email, password, and name are required',
                        details: {
                            email: !email ? 'Email is required' : null,
                            password: !password ? 'Password is required' : null,
                            name: !name ? 'Name is required' : null
                        }
                    })
                };
            }

            // Validate user type
            if (type && !['user', 'admin'].includes(type)) {
                return {
                    status: 400,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Invalid user type. Must be either "user" or "admin"' })
                };
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return {
                    status: 400,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Invalid email format' })
                };
            }

            // Password strength validation
            if (password.length < 6) {
                return {
                    status: 400,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Password must be at least 6 characters long' })
                };
            }

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: email.toLowerCase() }
            });

            if (existingUser) {
                return {
                    status: 409,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'User with this email already exists' })
                };
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

            // Create user
            const user = await prisma.user.create({
                data: {
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    name: name.trim(),
                    type: type
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    type: true,
                    createdAt: true
                }
            });

            context.log(`User registered successfully by admin: ${user.email} (type: ${user.type})`);

            return {
                status: 201,
                headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: true,
                    message: 'User registered successfully',
                    user
                })
            };

        } catch (error) {
            context.log.error('Registration error:', error);
            
            // Handle Prisma-specific errors
            if (error.code === 'P2002') {
                return {
                    status: 409,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'User with this email already exists' })
                };
            }
            
            return {
                status: 500,
                headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'Internal server error',
                    message: 'Registration failed. Please try again.',
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined
                })
            };
        } finally {
            await prisma.$disconnect();
        }
    }
});
