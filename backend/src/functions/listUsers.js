const { app } = require('@azure/functions');
const { authenticate, getCorsHeaders, handleCors } = require('../middleware/auth');
const { getAllUsers } = require('../utils/database');

app.http('listUsers', {
    methods: ['GET', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('List users request received');
        
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
            
            // Get all users
            const users = await getAllUsers();
            
            // Return users list
            return {
                status: 200,
                headers: {
                    ...getCorsHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    success: true,
                    message: 'Users retrieved successfully',
                    data: {
                        users: users,
                        count: users.length
                    }
                })
            };
            
        } catch (error) {
            context.log.error('List users error:', error);
            
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
