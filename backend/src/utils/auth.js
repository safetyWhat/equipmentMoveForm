const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Load environment variables for local development
// Change the condition to check if we're NOT in Azure Functions
if (!process.env.AzureWebJobsStorage || process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

// Configuration - Add debugging
console.log('Loading auth configuration...');
console.log('JWT_SECRET from env:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('JWT_EXPIRES_IN from env:', process.env.JWT_EXPIRES_IN);

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const BCRYPT_ROUNDS = 12;

console.log('Final JWT_SECRET:', JWT_SECRET.substring(0, 20) + '...');
console.log('Final JWT_EXPIRES_IN:', JWT_EXPIRES_IN);

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
async function hashPassword(password) {
    try {
        const saltRounds = BCRYPT_ROUNDS;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
}

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<boolean>} - True if password matches
 */
async function verifyPassword(password, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error('Error verifying password');
    }
}

/**
 * Generate a JWT token
 * @param {Object} payload - Token payload (user data)
 * @returns {string} - JWT token
 */
function generateToken(payload) {
    try {
        console.log('Generating token with payload:', payload);
        console.log('Using JWT_SECRET:', JWT_SECRET.substring(0, 20) + '...');
        console.log('Using JWT_EXPIRES_IN:', JWT_EXPIRES_IN);
        
        const token = jwt.sign(payload, JWT_SECRET, { 
            expiresIn: JWT_EXPIRES_IN 
        });
        
        // Decode the token to verify expiration
        const decoded = jwt.decode(token);
        console.log('Token generated successfully');
        console.log('Token expires at:', new Date(decoded.exp * 1000));
        console.log('Current time:', new Date());
        
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Error generating token');
    }
}

/**
 * Verify a JWT token
 * @param {string} token - JWT token
 * @returns {Object} - Decoded token payload
 */
function verifyToken(token) {
    try {
        console.log('Verifying token:', token.substring(0, 50) + '...');
        console.log('Using JWT_SECRET for verification:', JWT_SECRET.substring(0, 20) + '...');
        
        const decoded = jwt.verify(token, JWT_SECRET);
        
        console.log('Token verified successfully');
        console.log('Decoded payload:', decoded);
        console.log('Token expires at:', new Date(decoded.exp * 1000));
        console.log('Current time:', new Date());
        console.log('Time until expiry (seconds):', decoded.exp - Math.floor(Date.now() / 1000));
        
        return decoded;
    } catch (error) {
        console.error('Token verification failed:', error.message);
        console.error('Error name:', error.name);
        
        if (error.name === 'TokenExpiredError') {
            console.error('Token expired at:', new Date(error.expiredAt));
            throw new Error('Token expired');
        } else if (error.name === 'JsonWebTokenError') {
            console.error('Invalid token structure');
            throw new Error('Invalid token');
        } else {
            console.error('Other token error:', error);
            throw new Error('Token verification failed');
        }
    }
}

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} - Token or null if not found
 */
function extractTokenFromHeader(authHeader) {
    if (!authHeader) {
        return null;
    }
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }
    
    return parts[1];
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result
 */
function validatePassword(password) {
    const errors = [];
    
    if (!password || typeof password !== 'string') {
        errors.push('Password is required');
        return { isValid: false, errors };
    }
    
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    
    if (!/(?=.*[!@#$%^&*_])/.test(password)) {
        errors.push('Password must contain at least one special character (!@#$%^&*_)');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate user role
 * @param {string} role - Role to validate
 * @returns {boolean} - True if valid role
 */
function validateRole(role) {
    const validRoles = ['USER', 'ADMIN'];
    return validRoles.includes(role);
}

module.exports = {
    hashPassword,
    verifyPassword,
    generateToken,
    verifyToken,
    extractTokenFromHeader,
    validatePassword,
    validateEmail,
    validateRole
};
