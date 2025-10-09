import { NextResponse } from 'next/server';
import { getOnboardingAccount } from '@/lib/api.js';

// GET /api/onboarding/account
export async function GET() {
    try {
        const accountData = await getOnboardingAccount();
        return NextResponse.json(accountData);
    } catch (error) {
        console.error('Error fetching account data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch account data' },
            { status: 500 }
        );
    }
}
