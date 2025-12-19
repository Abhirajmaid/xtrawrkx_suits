import { NextResponse } from 'next/server';
import { communitySelectionSchema } from '@/lib/onboarding-schemas';

// PATCH /api/onboarding/communities
export async function PATCH(request) {
    try {
        const body = await request.json();

        // Get email and accountId from request body or headers (extract before validation)
        const email = body.email || request.headers.get('x-user-email');
        const accountId = body.accountId || request.headers.get('x-account-id');

        // Extract communities data (exclude email and accountId from validation)
        const { email: _, accountId: __, ...communitiesData } = body;

        // Validate the communities data
        const validationResult = communitySelectionSchema.safeParse(communitiesData);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid data', details: validationResult.error.errors },
                { status: 400 }
            );
        }

        if (!email && !accountId) {
            return NextResponse.json(
                { error: 'Email or account ID is required' },
                { status: 400 }
            );
        }

        const { selectedCommunities } = validationResult.data;

        // Call Strapi backend directly
        const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
        const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
            request.cookies.get('client_token')?.value ||
            request.headers.get('x-auth-token');

        const response = await fetch(`${strapiUrl}/api/onboarding/communities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify({
                accountId: accountId || null,
                email: email,
                selectedCommunities: selectedCommunities
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        return NextResponse.json({ ok: true, data: result });
    } catch (error) {
        console.error('Error saving communities:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to save communities' },
            { status: 500 }
        );
    }
}
