import { NextResponse } from 'next/server';
import { completeOnboarding, getOnboardingStatus } from '@/lib/api.js';

// POST /api/onboarding/complete
export async function POST(request) {
    try {
        const body = await request.json();
        const result = await completeOnboarding(body);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Error completing onboarding:', error);
        return NextResponse.json(
            { error: 'Failed to complete onboarding' },
            { status: 500 }
        );
    }
}

// GET /api/onboarding/complete - Check completion status
export async function GET() {
    try {
        const status = await getOnboardingStatus();
        return NextResponse.json(status);
    } catch (error) {
        console.error('Error fetching completion status:', error);
        return NextResponse.json(
            { error: 'Failed to fetch completion status' },
            { status: 500 }
        );
    }
}
