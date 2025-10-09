import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/middleware/auth'

// GET /api/onboarding/account - Get user account data for onboarding
async function getAccountData(req: NextRequest & { user: any }) {
    try {
        const userId = req.user.userId

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                email: true,
                phone: true,
                name: true,
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            email: user.email,
            phone: user.phone || '',
            name: user.name || '',
        })

    } catch (error) {
        console.error('Error fetching account data:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export const GET = withAuth(getAccountData)
