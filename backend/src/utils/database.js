const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client
const prisma = new PrismaClient();

/**
 * Create a new user
 * @param {Object} userData - User data
 * @param {string} userData.email - User email
 * @param {string} userData.password - Hashed password
 * @param {string} userData.role - User role (USER or ADMIN)
 * @returns {Promise<Object>} - Created user (without password)
 */
async function createUser(userData) {
    try {
        const user = await prisma.user.create({
            data: userData,
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return user;
    } catch (error) {
        if (error.code === 'P2002') {
            throw new Error('Email already exists');
        }
        throw new Error('Error creating user');
    }
}

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} - User with password or null if not found
 */
async function findUserByEmail(email) {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });
        return user;
    } catch (error) {
        throw new Error('Error finding user');
    }
}

/**
 * Find user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object|null>} - User without password or null if not found
 */
async function findUserById(id) {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return user;
    } catch (error) {
        throw new Error('Error finding user');
    }
}

/**
 * Update user
 * @param {string} id - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated user (without password)
 */
async function updateUser(id, updateData) {
    try {
        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return user;
    } catch (error) {
        if (error.code === 'P2002') {
            throw new Error('Email already exists');
        }
        if (error.code === 'P2025') {
            throw new Error('User not found');
        }
        throw new Error('Error updating user');
    }
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {Promise<Object>} - Deleted user (without password)
 */
async function deleteUser(id) {
    try {
        const user = await prisma.user.delete({
            where: { id },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
        return user;
    } catch (error) {
        if (error.code === 'P2025') {
            throw new Error('User not found');
        }
        throw new Error('Error deleting user');
    }
}

/**
 * Get all users (admin only)
 * @returns {Promise<Array>} - Array of users (without passwords)
 */
async function getAllUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return users;
    } catch (error) {
        throw new Error('Error fetching users');
    }
}

/**
 * Create equipment move entry
 * @param {Object} moveData - Equipment move data
 * @param {string} userId - User ID (optional)
 * @returns {Promise<Object>} - Created equipment move
 */
async function createEquipmentMove(moveData, userId = null) {
    try {
        const equipmentMove = await prisma.equipmentMove.create({
            data: {
                ...moveData,
                userId: userId,
                photos: moveData.photos ? JSON.stringify(moveData.photos) : null
            }
        });
        return equipmentMove;
    } catch (error) {
        if (error.code === 'P2002') {
            throw new Error('Submission ID already exists');
        }
        throw new Error('Error creating equipment move');
    }
}

/**
 * Close Prisma connection
 */
async function disconnect() {
    await prisma.$disconnect();
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    updateUser,
    deleteUser,
    getAllUsers,
    createEquipmentMove,
    disconnect,
    prisma
};
