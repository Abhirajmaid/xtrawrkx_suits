// Health check endpoint for Chrome extension
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        return NextResponse.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'Xtrawrkx CRM Portal',
            version: '1.0.0',
            endpoints: {
                contacts: '/api/contacts',
                users: '/api/users',
                health: '/api/health'
            }
        });
    } catch (error) {
        console.error('Health check error:', error);
        return NextResponse.json(
            {
                status: 'error',
                error: 'Internal server error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}


