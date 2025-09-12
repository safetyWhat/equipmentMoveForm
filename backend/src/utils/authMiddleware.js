const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const AUTH_CONFIG = {
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '8h',
    REMEMBER_ME_EXPIRES_IN: '30d'
};

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
                email: true,
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

        context.log(`User authenticated: ${user.email}`);
        return { success: true, user, userId: user.id }; // Add userId to return

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
function generateToken(userId, email, rememberMe = false) {
    const expiresIn = rememberMe ? AUTH_CONFIG.REMEMBER_ME_EXPIRES_IN : AUTH_CONFIG.JWT_EXPIRES_IN;
    
    return jwt.sign(
        { userId, email },
        AUTH_CONFIG.JWT_SECRET,
        { expiresIn }
    );
}

// Helper function to create unauthorized response
function createUnauthorizedResponse(error = 'Unauthorized') {
    return {
        status: 401,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error })
    };
}

// CORS headers helper
function getCorsHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
    };
}

module.exports = {
    verifyJWT,
    createUnauthorizedResponse,
    generateToken,
    getCorsHeaders,
    AUTH_CONFIG
};
