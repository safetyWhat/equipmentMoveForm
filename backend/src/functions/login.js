const { app } = require('@azure/functions');
const { validateEmail, verifyPassword, generateToken } = require('../utils/auth');
const { findUserByEmail } = require('../utils/database');
const { getCorsHeaders, handleCors } = require('../middleware/auth');

app.http('login', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Login request received');
        
        // Handle CORS preflight
        const corsResponse = handleCors(request);
        if (corsResponse) {
            return corsResponse;
        }
        
        // Only allow POST for login
        if (request.method !== 'POST') {
            return {
                status: 405,
                headers: getCorsHeaders(),
                body: JSON.stringify({
                    success: false,
                    message: 'Method not allowed'
                })
            };
        }
        
        try {
            // Parse request body
            const requestBody = await request.text();
            let data;
            
            try {
                data = JSON.parse(requestBody);
            } catch (parseError) {
                return {
                    status: 400,
                    headers: getCorsHeaders(),
                    body: JSON.stringify({
                        success: false,
                        message: 'Invalid JSON in request body'
                    })
                };
            }
            
            // Validate input
            const { email, password } = data;
            
            if (!email || !password) {
                return {
                    status: 400,
                    headers: getCorsHeaders(),
                    body: JSON.stringify({
                        success: false,
                        message: 'Email and password are required'
                    })
                };
            }
            
            // Validate email format
            if (!validateEmail(email)) {
                return {
                    status: 400,
                    headers: getCorsHeaders(),
                    body: JSON.stringify({
                        success: false,
                        message: 'Invalid email format'
                    })
                };
            }
            
            // Find user by email
            const user = await findUserByEmail(email);
            
            if (!user) {
                return {
                    status: 401,
                    headers: getCorsHeaders(),
                    body: JSON.stringify({
                        success: false,
                        message: 'Invalid email or password'
                    })
                };
            }
            
            // Verify password
            const isPasswordValid = await verifyPassword(password, user.password);
            
            if (!isPasswordValid) {
                return {
                    status: 401,
                    headers: getCorsHeaders(),
                    body: JSON.stringify({
                        success: false,
                        message: 'Invalid email or password'
                    })
                };
            }
            
            // Generate JWT token
            const tokenPayload = {
                id: user.id,
                email: user.email,
                role: user.role
            };
            
            const token = generateToken(tokenPayload);
            
            // Return success response
            return {
                status: 200,
                headers: {
                    ...getCorsHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: true,
                    message: 'Login successful',
                    data: {
                        token,
                        user: {
                            id: user.id,
                            email: user.email,
                            role: user.role,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt
                        }
                    }
                })
            };
            
        } catch (error) {
            context.log.error('Login error:', error);
            
            return {
                status: 500,
                headers: getCorsHeaders(),
                body: JSON.stringify({
                    success: false,
                    message: 'Internal server error'
                })
            };
        }
    }
});
