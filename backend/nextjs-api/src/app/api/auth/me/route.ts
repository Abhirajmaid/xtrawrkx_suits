import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withFirebaseAuth } from '@/middleware/firebaseAuth'

// GET /api/auth/me - Get current user info
async function getCurrentUser(req: NextRequest & { user: any }) {
    try {
        const userId = req.user.userId

        const user = await prisma.xtrawrkxUser.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firebaseUid: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                department: true,
                phone: true,
                authProvider: true,
                emailVerified: true,
                profileImage: true,
                isActive: true,
                lastLoginAt: true,
                createdAt: true,
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            id: user.id,
            firebaseUid: user.firebaseUid,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            department: user.department,
            phone: user.phone,
            authProvider: user.authProvider,
            emailVerified: user.emailVerified,
            profileImage: user.profileImage,
            isActive: user.isActive,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
        })

    } catch (error) {
        console.error('Error fetching current user:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export const GET = withFirebaseAuth(getCurrentUser)
