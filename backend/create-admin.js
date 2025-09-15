const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        const username = process.argv[2];
        const password = process.argv[3];
        const name = process.argv[4];

        if (!username || !password || !name) {
            console.log('Usage: node create-admin.js <username> <password> <name>');
            console.log('Example: node create-admin.js admin mypassword "Admin User"');
            return;
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            console.log(`User with username ${username} already exists`);
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create admin user
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                name,
                type: 'admin'
            }
        });

        console.log('Admin user created successfully:');
        console.log(`ID: ${user.id}`);
        console.log(`Username: ${user.username}`);
        console.log(`Name: ${user.name}`);
        console.log(`Type: ${user.type}`);
        
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
