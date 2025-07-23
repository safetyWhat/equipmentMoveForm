const { verifyToken, extractTokenFromHeader } = require('../utils/auth');
const { findUserById } = require('../utils/database');

/**
 * Authentication middleware for Azure Functions
 * @param {Object} request - Azure Functions request object
 * @returns {Promise<Object>} - Authentication result
 */
async function authenticateUser(request) {
    try {
        // Normalize header access - Azure Functions uses lowercase
        const authHeader = request.headers.authorization || request.headers['Authorization'];
        const token = extractTokenFromHeader(authHeader);
        
        if (!token) {
            return {
                isAuthenticated: false,
                error: 'Authentication required',
                statusCode: 401
            };
        }

        // Verify token with better error handling
        let decoded;
        try {
            decoded = verifyToken(token);
        } catch (tokenError) {
            return {
                isAuthenticated: false,
                error: 'Invalid or expired token',
                statusCode: 401
            };
        }
        
        // Get user from database
        const user = await findUserById(decoded.id);
        
        if (!user) {
            return {
                isAuthenticated: false,
                error: 'Invalid credentials',
                statusCode: 401
            };
        }
        
        return {
            isAuthenticated: true,
            user: user,
            token: decoded
        };
        
    } catch (error) {
        console.error('Authentication error:', error);
        return {
            isAuthenticated: false,
            error: 'Authentication failed',
            statusCode: 401
        };
    }
}

/**
 * Authorization middleware to check if user has required role
 * @param {Object} user - User object
 * @param {string} requiredRole - Required role (USER or ADMIN)
 * @returns {Object} - Authorization result
 */
function authorizeUser(user, requiredRole) {
    if (!user || !user.role) {
        return {
            isAuthorized: false,
            error: 'User role not found',
            statusCode: 403
        };
    }
    
    // ADMIN can access everything
    if (user.role === 'ADMIN') {
        return {
            isAuthorized: true
        };
    }
    
    // Check if user has required role
    if (user.role === requiredRole) {
        return {
            isAuthorized: true
        };
    }
    
    return {
        isAuthorized: false,
        error: 'Insufficient permissions',
        statusCode: 403
    };
}

/**
 * Combined authentication and authorization middleware
 * @param {Object} request - Azure Functions request object
 * @param {string} requiredRole - Required role (optional)
 * @returns {Promise<Object>} - Combined auth result
 */
async function authenticate(request, requiredRole = null) {
    const authResult = await authenticateUser(request);
    
    if (!authResult.isAuthenticated) {
        return authResult;
    }
    
    // If no specific role required, just return authentication result
    if (!requiredRole) {
        return authResult;
    }
    
    // Check authorization
    const authzResult = authorizeUser(authResult.user, requiredRole);
    
    if (!authzResult.isAuthorized) {
        return {
            isAuthenticated: true,
            isAuthorized: false,
            user: authResult.user,
            error: authzResult.error,
            statusCode: authzResult.statusCode
        };
    }
    
    return {
        isAuthenticated: true,
        isAuthorized: true,
        user: authResult.user,
        token: authResult.token
    };
}

/**
 * Get CORS headers - should be environment-specific
 * @returns {Object} - CORS headers
 */
function getCorsHeaders() {
    const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
        process.env.ALLOWED_ORIGINS.split(',') : 
        ['http://localhost:3000', 'http://127.0.0.1:5500'];
    
    return {
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
            ? allowedOrigins[0] // Use first allowed origin in production
            : '*', // Allow all in development
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'true'
    };
}

/**
 * Handle CORS preflight requests
 * @param {Object} request - Azure Functions request object
 * @returns {Object|null} - CORS response or null if not OPTIONS
 */
function handleCors(request) {
    if (request.method === 'OPTIONS') {
        return {
            status: 200,
            headers: getCorsHeaders()
        };
    }
    return null;
}

module.exports = {
    authenticateUser,
    authorizeUser,
    authenticate,
    getCorsHeaders,
    handleCors
};
