const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const AUTH_CONFIG = {
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
    REMEMBER_ME_EXPIRES_IN: '30d'
};

// CORS headers helper - Updated for better development support
function getCorsHeaders() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return {
        'Access-Control-Allow-Origin': isDevelopment ? 'http://localhost:3000' : '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400'
    };
}

// JWT verification utility for Azure Functions
async function verifyJWT(request, context) {
    try {
        // Get token from Authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            context.log.warn('No valid authorization header found');
            return { success: false, error: 'No token provided' };
        }

        const token = authHeader.split(' ')[1];
        
        // Verify JWT
        const decoded = jwt.verify(token, AUTH_CONFIG.JWT_SECRET);
        
        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                id: true,
                username: true,
                name: true,
                type: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            context.log.warn(`User not found for token: ${decoded.userId}`);
            return { success: false, error: 'User not found' };
        }

        context.log(`User authenticated: ${user.username}`);
        return { success: true, user, userId: user.id };

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            context.log.warn('Invalid JWT token:', error.message);
            return { success: false, error: 'Invalid token' };
        } else if (error.name === 'TokenExpiredError') {
            context.log.warn('JWT token expired:', error.message);
            return { success: false, error: 'Token expired' };
        } else {
            context.log.error('JWT verification error:', error);
            return { success: false, error: 'Authentication failed' };
        }
    } finally {
        await prisma.$disconnect();
    }
}

// Generate JWT token
function generateToken(userId, username, rememberMe = false) {
    const expiresIn = rememberMe ? AUTH_CONFIG.REMEMBER_ME_EXPIRES_IN : AUTH_CONFIG.JWT_EXPIRES_IN;
    
    return jwt.sign(
        { userId, username },
        AUTH_CONFIG.JWT_SECRET,
        { expiresIn }
    );
}

// Updated helper function to create unauthorized response with proper CORS
function createUnauthorizedResponse(error = 'Unauthorized') {
    return {
        status: 401,
        headers: {
            ...getCorsHeaders(),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            error: error,
            authenticated: false
        })
    };
}

module.exports = {
    verifyJWT,
    createUnauthorizedResponse,
    generateToken,
    getCorsHeaders,
    AUTH_CONFIG
};
