const { app } = require('@azure/functions');
const { PrismaClient } = require('@prisma/client');
const { getCorsHeaders, verifyJWT } = require('../utils/authMiddleware');

const prisma = new PrismaClient();

app.http('getUsers', {
    methods: ['GET', 'OPTIONS'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Get users request received');
        
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
                    status: authResult.status,
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

            // Get all users
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    name: true,
                    type: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: { equipmentMoves: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            context.log(`Retrieved ${users.length} users for admin: ${adminUser.email}`);

            return {
                status: 200,
                headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: true,
                    users: users.map(user => ({
                        ...user,
                        equipmentMoveCount: user._count.equipmentMoves
                    }))
                })
            };

        } catch (error) {
            context.log.error('Get users error:', error);
            return {
                status: 500,
                headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'Internal server error',
                    message: 'Failed to retrieve users. Please try again.',
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined
                })
            };
        } finally {
            await prisma.$disconnect();
        }
    }
});
