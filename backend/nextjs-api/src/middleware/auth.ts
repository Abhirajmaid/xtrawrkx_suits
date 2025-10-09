import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function withAuth(handler: Function) {
    return async (req: NextRequest, ...args: any[]) => {
        try {
            const token = req.headers.get('authorization')?.replace('Bearer ', '')

            if (!token) {
                return NextResponse.json({ error: 'No token provided' }, { status: 401 })
            }

            const decoded = verifyToken(token)

            // Add user info to request
            const requestWithUser = Object.assign(req, { user: decoded })

            return handler(requestWithUser, ...args)
        } catch (error) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }
    }
}
