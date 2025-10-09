import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/middleware/auth'

// POST /api/onboarding/complete - Complete onboarding process
async function completeOnboarding(req: NextRequest & { user: any }) {
    try {
        const userId = req.user.userId

        // Mark onboarding as completed
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                onboarded: true,
                needsOnboarding: false,
                onboardingCompletedAt: new Date()
            },
            select: {
                id: true,
                email: true,
                name: true,
                onboarded: true,
                needsOnboarding: true,
                onboardingCompletedAt: true
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Onboarding completed successfully',
            redirectTo: '/dashboard',
            user
        })

    } catch (error) {
        console.error('Error completing onboarding:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// GET /api/onboarding/complete - Check completion status
async function getCompletionStatus(req: NextRequest & { user: any }) {
    try {
        const userId = req.user.userId

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                onboarded: true,
                needsOnboarding: true,
                onboardingCompletedAt: true,
                onboardingData: true
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            onboarded: user.onboarded,
            needsOnboarding: user.needsOnboarding,
            onboardingCompletedAt: user.onboardingCompletedAt,
            onboardingData: user.onboardingData
        })

    } catch (error) {
        console.error('Error fetching completion status:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export const POST = withAuth(completeOnboarding)
export const GET = withAuth(getCompletionStatus)
