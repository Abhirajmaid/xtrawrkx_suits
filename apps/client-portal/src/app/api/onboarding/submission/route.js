import { NextResponse } from 'next/server';
import { saveOnboardingSubmission } from '@/lib/api.js';
import { submissionSchemas } from '@/lib/onboarding-schemas';

// POST /api/onboarding/submission
export async function POST(request) {
    try {
        const body = await request.json();
        const { community, data } = body;

        // Validate community key
        if (!community || !['XEN', 'XEVFIN', 'XEVTG', 'XDD'].includes(community)) {
            return NextResponse.json(
                { error: 'Invalid community' },
                { status: 400 }
            );
        }

        // Validate submission data based on community
        const schema = submissionSchemas[community];
        const validationResult = schema.safeParse(data);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid submission data', details: validationResult.error.errors },
                { status: 400 }
            );
        }

        const submissionData = validationResult.data;
        const result = await saveOnboardingSubmission({
            community,
            submissionData
        });

        // Generate a mock submission ID for response
        const submissionId = `${community.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Return submission result
        const response = {
            submissionId,
            status: 'submitted',
            community,
            submittedAt: new Date().toISOString(),
            ...result
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error saving submission:', error);
        return NextResponse.json(
            { error: 'Failed to save submission' },
            { status: 500 }
        );
    }
}
