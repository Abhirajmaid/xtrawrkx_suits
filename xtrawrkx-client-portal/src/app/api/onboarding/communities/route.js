import { NextResponse } from 'next/server';
import { saveOnboardingCommunities } from '@/lib/api.js';
import { communitySelectionSchema } from '@/lib/onboarding-schemas';

// PATCH /api/onboarding/communities
export async function PATCH(request) {
    try {
        const body = await request.json();

        // Validate the request body
        const validationResult = communitySelectionSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid data', details: validationResult.error.errors },
                { status: 400 }
            );
        }

        const { selectedCommunities } = validationResult.data;
        const result = await saveOnboardingCommunities({ selectedCommunities });

        return NextResponse.json({ ok: true, data: result });
    } catch (error) {
        console.error('Error saving communities:', error);
        return NextResponse.json(
            { error: 'Failed to save communities' },
            { status: 500 }
        );
    }
}
