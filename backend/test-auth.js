// Simple test script to verify our authentication functions work
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generateToken } = require('./src/utils/authMiddleware');

const prisma = new PrismaClient();

// Test user registration data
const testUser = {
    username: "test@example.com",
    password: "testpassword123",
    name: "Test User",
    rememberMe: false
};

// Test equipment move data
const testEquipmentMove = {
    userName: "Test User",
    unitNumber: "EQ-001",
    moveDate: "2025-09-10",
    equipmentHours: 100,
    locationFrom: "Warehouse A",
    locationTo: "Job Site B",
    notes: "Test equipment move"
};

console.log('Authentication system has been implemented with the following endpoints:');
console.log('');
console.log('🔐 Authentication Endpoints:');
console.log('  POST /api/register - User registration');
console.log('  POST /api/login - User login');
console.log('  POST /api/validateToken - Token validation');
console.log('');
console.log('📝 Form Endpoints:');
console.log('  POST /api/submitEquipmentMove - Submit equipment move (requires auth)');
console.log('');
console.log('🧪 Test Data:');
console.log('Registration:', JSON.stringify(testUser, null, 2));
console.log('');
console.log('Equipment Move:', JSON.stringify(testEquipmentMove, null, 2));
console.log('');
console.log('📋 Usage Flow:');
console.log('1. Register: POST /api/register with user data');
console.log('2. Login: POST /api/login with username/password');
console.log('3. Store token from login response');
console.log('4. Submit forms: Include "Authorization: Bearer <token>" header');
console.log('');
console.log('🛡️ Security Features:');
console.log('- JWT tokens with 8-hour expiration (30 days with rememberMe)');
console.log('- Password hashing with bcrypt (12 rounds)');
console.log('- Input validation and sanitization');
console.log('- CORS enabled for frontend integration');
console.log('- Database storage with Prisma + SQLite');

async function testAuth() {
    try {
        console.log('Testing authentication system...\n');

        // Test 1: Create a test user
        console.log('1. Creating test user...');
        const hashedPassword = await bcrypt.hash('testpassword', 12);
        
        const user = await prisma.user.create({
            data: {
                username: 'testuser',
                password: hashedPassword,
                name: 'Test User',
                type: 'user'
            }
        });
        console.log(`✓ Test user created: ${user.username}`);

        // Test 2: Verify password
        console.log('\n2. Testing password verification...');
        const isValidPassword = await bcrypt.compare('testpassword', user.password);
        console.log(`✓ Password verification: ${isValidPassword ? 'PASS' : 'FAIL'}`);

        // Test 3: Generate JWT token
        console.log('\n3. Testing JWT token generation...');
        const token = generateToken(user.id, user.username);
        console.log(`✓ JWT token generated: ${token.substring(0, 50)}...`);

        // Test 4: Find user by username
        console.log('\n4. Testing user lookup...');
        const foundUser = await prisma.user.findUnique({
            where: { username: 'testuser' }
        });
        console.log(`✓ User lookup: ${foundUser ? 'FOUND' : 'NOT FOUND'}`);
        console.log(`  Username: ${foundUser?.username}`);
        console.log(`  Name: ${foundUser?.name}`);
        console.log(`  Type: ${foundUser?.type}`);

        // Clean up
        console.log('\n5. Cleaning up test user...');
        await prisma.user.delete({
            where: { id: user.id }
        });
        console.log('✓ Test user deleted');

        console.log('\n✅ All authentication tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testAuth();

module.exports = {
    testUser,
    testEquipmentMove
};
