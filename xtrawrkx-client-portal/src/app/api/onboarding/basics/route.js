import { NextResponse } from 'next/server';
import { saveOnboardingBasics } from '@/lib/api.js';
import { userBasicsSchema } from '@/lib/onboarding-schemas';

// PATCH /api/onboarding/basics
export async function PATCH(request) {
    try {
        const body = await request.json();

        // Validate the request body
        const validationResult = userBasicsSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid data', details: validationResult.error.errors },
                { status: 400 }
            );
        }

        const basicsData = validationResult.data;
        const result = await saveOnboardingBasics(basicsData);

        return NextResponse.json({ ok: true, data: result });
    } catch (error) {
        console.error('Error saving basics:', error);
        return NextResponse.json(
            { error: 'Failed to save basics' },
            { status: 500 }
        );
    }
}
