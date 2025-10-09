import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/middleware/auth'

// POST /api/onboarding/basics - Save user basics data
async function saveBasicsData(req: NextRequest & { user: any }) {
    try {
        const userId = req.user.userId
        const { name, role, experience, interests } = await req.json()

        // Update user with basics data
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                onboardingData: {
                    basics: {
                        name,
                        role,
                        experience,
                        interests
                    }
                }
            },
            select: {
                id: true,
                name: true,
                onboardingData: true
            }
        })

        return NextResponse.json({
            success: true,
            data: user.onboardingData
        })

    } catch (error) {
        console.error('Error saving basics data:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export const POST = withAuth(saveBasicsData)
