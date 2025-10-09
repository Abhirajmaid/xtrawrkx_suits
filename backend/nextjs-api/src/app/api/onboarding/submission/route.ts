import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/middleware/auth'

// POST /api/onboarding/submission - Save community submission data
async function saveSubmissionData(req: NextRequest & { user: any }) {
    try {
        const userId = req.user.userId
        const { community, submissionData } = await req.json()

        // Get existing onboarding data
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { onboardingData: true }
        })

        const existingData = user?.onboardingData || {}
        const existingSubmissions = existingData.submissions || {}

        // Update user with submission data
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                onboardingData: {
                    ...existingData,
                    submissions: {
                        ...existingSubmissions,
                        [community]: submissionData
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
        console.error('Error saving submission data:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export const POST = withAuth(saveSubmissionData)
