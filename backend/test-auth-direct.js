const { generateToken, verifyToken } = require('./src/utils/auth');

// Test direct auth function usage
console.log('=== Testing Auth Functions Directly ===');

// Test environment loading as done in Azure Functions
console.log('Environment variables:');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 20) + '...' : 'NOT SET');
console.log('JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN);

// Test token generation
const testUser = {
    id: 'user-123',
    email: 'test@example.com',
    role: 'USER'
};

try {
    console.log('\n=== Generating Token ===');
    const token = generateToken(testUser);
    console.log('Token generated successfully');
    console.log('Token length:', token.length);
    
    // Decode token to check expiration
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    console.log('Token payload:', payload);
    
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - currentTime;
    console.log('Current time:', currentTime);
    console.log('Token expires at:', payload.exp);
    console.log('Time until expiry (seconds):', timeUntilExpiry);
    console.log('Time until expiry (hours):', timeUntilExpiry / 3600);
    
    // Test verification
    console.log('\n=== Verifying Token ===');
    const verified = verifyToken(token);
    console.log('Token verified:', verified ? 'SUCCESS' : 'FAILED');
    
} catch (error) {
    console.error('Error:', error.message);
}
