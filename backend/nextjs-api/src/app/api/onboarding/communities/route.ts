import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/middleware/auth'

// POST /api/onboarding/communities - Save selected communities
async function saveCommunitiesData(req: NextRequest & { user: any }) {
    try {
        const userId = req.user.userId
        const { selectedCommunities } = await req.json()

        // Get existing onboarding data
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { onboardingData: true }
        })

        const existingData = user?.onboardingData || {}

        // Update user with communities data
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                onboardingData: {
                    ...existingData,
                    communities: {
                        selectedCommunities
                    }
                }
            },
            select: {
                id: true,
                onboardingData: true
            }
        })

        return NextResponse.json({
            success: true,
            data: updatedUser.onboardingData
        })

    } catch (error) {
        console.error('Error saving communities data:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export const POST = withAuth(saveCommunitiesData)
