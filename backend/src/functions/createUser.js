// Load environment variables for local development
if (!process.env.AzureWebJobsStorage || process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

const { app } = require('@azure/functions');
const { validateEmail, validatePassword, validateRole, hashPassword } = require('../utils/auth');
const { createUser } = require('../utils/database');
const { authenticate, getCorsHeaders, handleCors } = require('../middleware/auth');

app.http('createUser', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Create user request received');
        
        // Handle CORS preflight
        const corsResponse = handleCors(request);
        if (corsResponse) {
            return corsResponse;
        }
        
        // Only allow POST for user creation
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
            // Authenticate user and require ADMIN role
            const authResult = await authenticate(request, 'ADMIN');
            
            if (!authResult.isAuthenticated) {
                return {
                    status: authResult.statusCode || 401,
                    headers: getCorsHeaders(),
                    body: JSON.stringify({
                        success: false,
                        message: authResult.error || 'Authentication failed'
                    })
                };
            }
            
            if (!authResult.isAuthorized) {
                return {
                    status: authResult.statusCode || 403,
                    headers: getCorsHeaders(),
                    body: JSON.stringify({
                        success: false,
                        message: authResult.error || 'Insufficient permissions'
                    })
                };
            }
            
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
            const { email, password, role = 'USER' } = data;
            
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
            
            // Validate password strength
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.isValid) {
                return {
                    status: 400,
                    headers: getCorsHeaders(),
                    body: JSON.stringify({
                        success: false,
                        message: 'Password validation failed',
                        errors: passwordValidation.errors
                    })
                };
            }
            
            // Validate role
            if (!validateRole(role)) {
                return {
                    status: 400,
                    headers: getCorsHeaders(),
                    body: JSON.stringify({
                        success: false,
                        message: 'Invalid role. Must be USER or ADMIN'
                    })
                };
            }
            
            // Hash password
            const hashedPassword = await hashPassword(password);
            
            // Create user
            const newUser = await createUser({
                email: email.toLowerCase(),
                password: hashedPassword,
                role: role
            });
            
            // Return success response
            return {
                status: 201,
                headers: {
                    ...getCorsHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: true,
                    message: 'User created successfully',
                    data: {
                        user: newUser
                    }
                })
            };
            
        } catch (error) {
            context.log.error('Create user error:', error);
            
            // Handle specific database errors
            if (error.message === 'Email already exists') {
                return {
                    status: 409,
                    headers: getCorsHeaders(),
                    body: JSON.stringify({
                        success: false,
                        message: 'Email already exists'
                    })
                };
            }
            
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
