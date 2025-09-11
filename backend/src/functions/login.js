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
                context.log.error('Failed to parse request body:', parseError);
                return {
                    status: 400,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Invalid JSON in request body' })
                };
            }

            const { email, password, rememberMe = false } = requestData;

            // Validation
            if (!email || !password) {
                return {
                    status: 400,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        error: 'Email and password are required',
                        details: {
                            email: !email ? 'Email is required' : null,
                            password: !password ? 'Password is required' : null
                        }
                    })
                };
            }

            // Find user
            const user = await prisma.user.findUnique({
                where: { email: email.toLowerCase() }
            });

            if (!user) {
                context.log.warn(`Login attempt for non-existent user: ${email}`);
                return {
                    status: 401,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Invalid email or password' })
                };
            }

            // Verify password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                context.log.warn(`Invalid password attempt for user: ${email}`);
                return {
                    status: 401,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Invalid email or password' })
                };
            }

            // Generate token
            const token = generateToken(user.id, user.email, rememberMe);

            context.log(`User logged in successfully: ${user.email}`);

            return {
                status: 200,
                headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: true,
                    message: 'Login successful',
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        type: user.type
                    },
                    expiresIn: rememberMe ? '30 days' : '8 hours'
                })
            };

        } catch (error) {
            context.log.error('Login error:', error);
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
