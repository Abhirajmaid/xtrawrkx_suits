import { NextResponse } from 'next/server';
import { userBasicsSchema } from '@/lib/onboarding-schemas';

// PATCH /api/onboarding/basics
export async function PATCH(request) {
    try {
        const body = await request.json();

        // Get email and accountId from request body or headers (extract before validation)
        const email = body.email || request.headers.get('x-user-email');
        const accountId = body.accountId || request.headers.get('x-account-id');

        // Extract basics data (exclude email and accountId from validation)
        const { email: _, accountId: __, ...basicsData } = body;

        // Validate the basics data
        const validationResult = userBasicsSchema.safeParse(basicsData);
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

        // Call Strapi backend directly
        const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
        const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
            request.cookies.get('client_token')?.value ||
            request.headers.get('x-auth-token');

        console.log('Calling Strapi backend:', {
            url: `${strapiUrl}/api/onboarding/basics`,
            hasToken: !!token,
            accountId: accountId || null,
            email: email,
            basicsKeys: Object.keys(basicsData || {})
        });

        const response = await fetch(`${strapiUrl}/api/onboarding/basics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify({
                accountId: accountId || null,
                email: email,
                basics: basicsData
            })
        });

        console.log('Strapi response status:', response.status, response.statusText);
        console.log('Strapi response headers:', Object.fromEntries(response.headers.entries()));

        // Get response text first to check content type
        const responseText = await response.text();
        console.log('Strapi response text length:', responseText.length);
        console.log('Strapi response text (first 500 chars):', responseText.substring(0, 500));

        if (!responseText || responseText.trim() === '') {
            console.error('Strapi returned empty response:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries())
            });
            throw new Error(`Server returned empty response: ${response.status} ${response.statusText}`);
        }

        let result;
        try {
            result = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse Strapi response as JSON:', {
                status: response.status,
                statusText: response.statusText,
                contentType: response.headers.get('content-type'),
                responseText: responseText.substring(0, 500),
                parseError: parseError.message,
                requestBody: {
                    accountId: accountId || null,
                    email: email,
                    basicsKeys: Object.keys(basicsData || {})
                }
            });
            throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}. Response: ${responseText.substring(0, 200)}`);
        }

        if (!response.ok) {
            const errorMessage = result.error?.message || result.message || result.error || `HTTP ${response.status}: ${response.statusText}`;
            console.error('Strapi API error:', {
                status: response.status,
                statusText: response.statusText,
                errorData: result,
                requestBody: {
                    accountId: accountId || null,
                    email: email,
                    basicsKeys: Object.keys(basicsData || {})
                }
            });
            throw new Error(errorMessage);
        }

        return NextResponse.json({ ok: true, data: result });
    } catch (error) {
        console.error('Error saving basics:', error);
        console.error('Error stack:', error.stack);
        console.error('Request body:', {
            email,
            accountId,
            basicsDataKeys: basicsData ? Object.keys(basicsData) : 'no basicsData',
            validationErrors: validationResult.success ? null : validationResult.error?.errors
        });
        return NextResponse.json(
            {
                error: error.message || 'Failed to save basics',
                details: process.env.NODE_ENV === 'development' ? {
                    stack: error.stack,
                    validationErrors: !validationResult.success ? validationResult.error?.errors : null
                } : undefined
            },
            { status: 500 }
        );
    }
}
