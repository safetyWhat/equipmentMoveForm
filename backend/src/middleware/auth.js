const { verifyToken, extractTokenFromHeader } = require('../utils/auth');
const { findUserById } = require('../utils/database');

/**
 * Authentication middleware for Azure Functions
 * @param {Object} request - Azure Functions request object
 * @returns {Promise<Object>} - Authentication result
 */
async function authenticateUser(request) {
    try {
        const authHeader = request.headers.authorization || request.headers.Authorization;
        const token = extractTokenFromHeader(authHeader);
        
        if (!token) {
            return {
                isAuthenticated: false,
                error: 'No token provided',
                statusCode: 401
            };
        }
        
        // Verify token
        const decoded = verifyToken(token);
        
        // Get user from database
        const user = await findUserById(decoded.id);
        
        if (!user) {
            return {
                isAuthenticated: false,
                error: 'User not found',
                statusCode: 401
            };
        }
        
        return {
            isAuthenticated: true,
            user: user,
            token: decoded
        };
        
    } catch (error) {
        return {
            isAuthenticated: false,
            error: error.message,
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
 * Get CORS headers
 * @returns {Object} - CORS headers
 */
function getCorsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
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
