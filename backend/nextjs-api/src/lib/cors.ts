import { NextRequest, NextResponse } from 'next/server'

// Get allowed origins from environment variable or use default for development
const getAllowedOrigins = (): string[] => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS

    if (allowedOrigins) {
        return allowedOrigins.split(',').map(origin => origin.trim())
    }

    // Default origins for development
    return [
        'http://localhost:3001', // accounts app
        'http://localhost:3002', // client-portal app
        'http://localhost:3003', // crm-portal app
        'http://localhost:3004', // pm-dashboard app
        'http://localhost:3000', // any other local app
    ]
}

// Get CORS headers based on request origin
export const getCorsHeaders = (request: NextRequest) => {
    const allowedOrigins = getAllowedOrigins()
    const origin = request.headers.get('origin')

    // Check if the origin is allowed
    const isAllowedOrigin = origin && allowedOrigins.includes(origin)

    return {
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : allowedOrigins[0],
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400', // 24 hours
    }
}

// Helper function to handle OPTIONS requests
export const handleCorsOptions = (request: NextRequest) => {
    const corsHeaders = getCorsHeaders(request)
    return new NextResponse(null, { status: 200, headers: corsHeaders })
}

// Higher-order function to wrap API handlers with CORS
export function withCors<T extends NextRequest>(
    handler: (req: T, ...args: any[]) => Promise<NextResponse>
) {
    return async (req: T, ...args: any[]): Promise<NextResponse> => {
        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            return handleCorsOptions(req)
        }

        // Handle actual requests
        const response = await handler(req, ...args)
        const corsHeaders = getCorsHeaders(req)

        // Add CORS headers to the response
        Object.entries(corsHeaders).forEach(([key, value]) => {
            response.headers.set(key, value)
        })

        return response
    }
}

