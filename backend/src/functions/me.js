const { app } = require('@azure/functions');
const { authenticate, getCorsHeaders, handleCors } = require('../middleware/auth');

app.http('me', {
    methods: ['GET', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Get user profile request received');
        
        // Handle CORS preflight
        const corsResponse = handleCors(request);
        if (corsResponse) {
            return corsResponse;
        }
        
        // Only allow GET for this endpoint
        if (request.method !== 'GET') {
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
            // Authenticate user
            const authResult = await authenticate(request);
            
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
            
            // Return user profile
            return {
                status: 200,
                headers: {
                    ...getCorsHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: true,
                    message: 'User profile retrieved successfully',
                    data: {
                        user: authResult.user,
                        tokenInfo: {
                            exp: authResult.token.exp,
                            iat: authResult.token.iat
                        }
                    }
                })
            };
            
        } catch (error) {
            context.log.error('Get user profile error:', error);
            
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
