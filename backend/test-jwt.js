#!/usr/bin/env node

const jwt = require('jsonwebtoken');

// Test JWT functionality
console.log('=== JWT Test Script ===');

// Use the same values as in local.settings.json
const JWT_SECRET = 'f3a1c8b9c6d7e2a8479f1d2c3a4b5e6f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d';
const JWT_EXPIRES_IN = '7d';

console.log('JWT_SECRET:', JWT_SECRET.substring(0, 20) + '...');
console.log('JWT_EXPIRES_IN:', JWT_EXPIRES_IN);

// Create test payload
const testPayload = {
    id: 'test-user-123',
    email: 'test@example.com',
    role: 'ADMIN'
};

console.log('\n=== Generating Token ===');
try {
    const token = jwt.sign(testPayload, JWT_SECRET, { 
        expiresIn: JWT_EXPIRES_IN 
    });
    
    console.log('✅ Token generated successfully');
    console.log('Token length:', token.length);
    console.log('Token preview:', token.substring(0, 50) + '...');
    
    // Decode without verification to check structure
    const decoded = jwt.decode(token);
    console.log('Decoded payload:', decoded);
    console.log('Issued at:', new Date(decoded.iat * 1000));
    console.log('Expires at:', new Date(decoded.exp * 1000));
    console.log('Time until expiry (hours):', (decoded.exp - decoded.iat) / 3600);
    
    console.log('\n=== Verifying Token ===');
    
    // Verify the token
    const verified = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token verified successfully');
    console.log('Verified payload:', verified);
    
    // Test with wrong secret
    console.log('\n=== Testing Wrong Secret ===');
    try {
        jwt.verify(token, 'wrong-secret');
        console.log('❌ This should not work');
    } catch (error) {
        console.log('✅ Correctly rejected wrong secret:', error.message);
    }
    
} catch (error) {
    console.error('❌ Error:', error.message);
}

console.log('\n=== Environment Variables ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('JWT_SECRET from env:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('JWT_EXPIRES_IN from env:', process.env.JWT_EXPIRES_IN);

console.log('\n=== Test Complete ===');
