import { NextResponse } from 'next/server';
import { CMS_CONFIG } from '@/src/config/cms';

const STRAPI_API_URL = CMS_CONFIG.STRAPI_API_URL;

function strapiBaseUrl() {
    return STRAPI_API_URL.endsWith('/') ? STRAPI_API_URL.slice(0, -1) : STRAPI_API_URL;
}

export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
        }

        const response = await fetch(`${strapiBaseUrl()}/auth/me`, {
            method: 'GET',
            headers: {
                Authorization: authHeader,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Token verification failed' }));
            return NextResponse.json(
                { error: errorData.error || errorData.message || 'Token verification failed' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data.user || data, { status: 200 });
    } catch (error) {
        console.error('Token verification error:', error);
        return NextResponse.json(
            {
                error: error.message || 'Internal server error',
                details: 'Failed to verify token',
            },
            { status: 500 }
        );
    }
}
