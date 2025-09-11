const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
    try {
        // Check if admin already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'admin@company.com' }
        });

        if (existingAdmin) {
            console.log('Admin user already exists, updating type...');
            // Update existing user to be admin
            const updatedAdmin = await prisma.user.update({
                where: { email: 'admin@company.com' },
                data: { type: 'admin' }
            });
            console.log('Admin user updated:', updatedAdmin);
        } else {
            // Create new admin user
            const hashedPassword = await bcrypt.hash('admin123', 12);
            
            const admin = await prisma.user.create({
                data: {
                    email: 'admin@company.com',
                    password: hashedPassword,
                    name: 'System Administrator',
                    type: 'admin'
                }
            });
            
            console.log('Admin user created successfully:', {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                type: admin.type
            });
        }
        
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdmin();
