const { app } = require('@azure/functions');
const { verifyJWT, getCorsHeaders } = require('../utils/authMiddleware');

app.http('validateToken', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Token validation request received');
        
        // Handle CORS preflight request
        if (request.method === 'OPTIONS') {
            return {
                status: 200,
                headers: getCorsHeaders()
            };
        }

        try {
            const authResult = await verifyJWT(request, context);
            
            if (!authResult.success) {
                return {
                    status: 401,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        valid: false,
                        error: authResult.error 
                    })
                };
            }
            
            context.log(`Token validated for user: ${authResult.user.username}`);
            
            return {
                status: 200,
                headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    valid: true,
                    user: authResult.user
                })
            };
            
        } catch (error) {
            context.log.error('Token validation error:', error);
            return {
                status: 500,
                headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    valid: false,
                    error: 'Internal server error' 
                })
            };
        }
    }
});
