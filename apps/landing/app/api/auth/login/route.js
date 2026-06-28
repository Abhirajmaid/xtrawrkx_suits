import { NextResponse } from 'next/server';
import { CMS_CONFIG } from '@/src/config/cms';

const STRAPI_API_URL = CMS_CONFIG.STRAPI_API_URL;

function strapiBaseUrl() {
    return STRAPI_API_URL.endsWith('/') ? STRAPI_API_URL.slice(0, -1) : STRAPI_API_URL;
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password, identifier } = body;
        const userIdentifier = identifier || email;

        if (!userIdentifier || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const response = await fetch(`${strapiBaseUrl()}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                identifier: userIdentifier,
                password,
            }),
        });

        let data;
        try {
            data = await response.json();
        } catch (parseError) {
            console.error('Failed to parse Strapi login response:', parseError);
            return NextResponse.json(
                {
                    error: 'Invalid response from authentication server',
                    details: 'Unable to process server response',
                },
                { status: 500 }
            );
        }

        if (!response.ok) {
            const errorMessage =
                data.error?.message ||
                (typeof data.error === 'string' ? data.error : null) ||
                data.message ||
                'Authentication failed. Please try again.';

            return NextResponse.json({ error: errorMessage }, { status: response.status });
        }

        return NextResponse.json(
            {
                jwt: data.token || data.jwt,
                token: data.token || data.jwt,
                user: data.user,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Login API error:', error);
        return NextResponse.json(
            {
                error: error.message || 'Internal server error',
                details: 'Failed to connect to authentication server',
            },
            { status: 500 }
        );
    }
}
