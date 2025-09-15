const { app } = require('@azure/functions');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { generateToken, getCorsHeaders } = require('../utils/authMiddleware');

const prisma = new PrismaClient();

app.http('login', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('User login request received');
        
        // Handle CORS preflight request
        if (request.method === 'OPTIONS') {
            return {
                status: 200,
                headers: getCorsHeaders()
            };
        }

        try {
            // Parse request body
            let requestData;
            try {
                const rawBody = await request.text();
                requestData = JSON.parse(rawBody);
            } catch (parseError) {
                context.error('Failed to parse request body:', parseError);
                return {
                    status: 400,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Invalid JSON in request body' })
                };
            }

            const { username, password, rememberMe = false } = requestData;

            // Validation
            if (!username || !password) {
                return {
                    status: 400,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        error: 'username and password are required',
                        details: {
                            username: !username ? 'username is required' : null,
                            password: !password ? 'Password is required' : null
                        }
                    })
                };
            }

            // Find user
            const user = await prisma.user.findUnique({
                where: { username: username.toLowerCase() }
            });

            if (!user) {
                context.warn(`Login attempt for non-existent user: ${username}`);
                return {
                    status: 401,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Invalid username or password' })
                };
            }

            // Verify password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                context.warn(`Invalid password attempt for user: ${username}`);
                return {
                    status: 401,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Invalid username or password' })
                };
            }

            // Generate token
            const token = generateToken(user.id, user.username, rememberMe);

            context.log(`User logged in successfully: ${user.username}`);

            return {
                status: 200,
                headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: true,
                    message: 'Login successful',
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        name: user.name,
                        type: user.type
                    },
                    expiresIn: rememberMe ? '30 days' : '8 hours'
                })
            };

        } catch (error) {
            context.error('Login error:', error);
            return {
                status: 500,
                headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'Internal server error',
                    message: 'Login failed. Please try again.',
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined
                })
            };
        } finally {
            await prisma.$disconnect();
        }
    }
});
