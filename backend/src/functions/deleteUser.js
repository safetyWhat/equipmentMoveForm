const { app } = require('@azure/functions');
const { PrismaClient } = require('@prisma/client');
const { getCorsHeaders, verifyJWT } = require('../utils/authMiddleware');

const prisma = new PrismaClient();

app.http('deleteUser', {
    methods: ['DELETE', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Delete user request received');
        
        // Handle CORS preflight request
        if (request.method === 'OPTIONS') {
            return {
                status: 200,
                headers: getCorsHeaders()
            };
        }

        try {
            // Verify admin authentication
            const authResult = await verifyJWT(request, context);
            if (!authResult.success) {
                return {
                    status: 401,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: authResult.error })
                };
            }

            // Check if user is admin
            const adminUser = await prisma.user.findUnique({
                where: { id: authResult.userId }
            });

            if (!adminUser || adminUser.type !== 'admin') {
                return {
                    status: 403,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Access denied. Admin privileges required.' })
                };
            }

            // Get user ID from URL parameters
            const url = new URL(request.url);
            const userId = url.searchParams.get('userId');

            if (!userId) {
                return {
                    status: 400,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'User ID is required as a query parameter' })
                };
            }

            // Prevent admin from deleting themselves
            if (userId === adminUser.id) {
                return {
                    status: 400,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'Cannot delete your own account' })
                };
            }

            // Check if user exists
            const userToDelete = await prisma.user.findUnique({
                where: { id: userId },
                include: {
                    _count: {
                        select: { equipmentMoves: true }
                    }
                }
            });

            if (!userToDelete) {
                return {
                    status: 404,
                    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                    body: JSON.stringify({ error: 'User not found' })
                };
            }

            // Delete user (this will cascade delete equipment moves due to foreign key relationship)
            await prisma.user.delete({
                where: { id: userId }
            });

            context.log(`User deleted successfully by admin: ${userToDelete.email} (admin: ${adminUser.email})`);

            return {
                status: 200,
                headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: true,
                    message: 'User deleted successfully',
                    deletedUser: {
                        id: userToDelete.id,
                        email: userToDelete.email,
                        name: userToDelete.name,
                        type: userToDelete.type,
                        equipmentMoveCount: userToDelete._count.equipmentMoves
                    }
                })
            };

        } catch (error) {
            context.log.error('Delete user error:', error);
            
            return {
                status: 500,
                headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'Internal server error',
                    message: 'Failed to delete user. Please try again.',
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined
                })
            };
        } finally {
            await prisma.$disconnect();
        }
    }
});
