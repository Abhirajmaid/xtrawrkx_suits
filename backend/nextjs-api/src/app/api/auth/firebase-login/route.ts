import { NextRequest, NextResponse } from 'next/server'
import { verifyFirebaseToken, createOrUpdateXtrawrkxUser } from '@/lib/firebaseAuth'
import { generateToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        const { idToken, userData } = await req.json()

        if (!idToken) {
            return NextResponse.json({ error: 'Firebase ID token is required' }, { status: 400 })
        }

        // Verify Firebase token
        const firebaseUser = await verifyFirebaseToken(idToken)

        // Create or update user in database with additional data if provided
        const user = await createOrUpdateXtrawrkxUser(firebaseUser, userData)

        if (!user.isActive) {
            return NextResponse.json({ error: 'Account is deactivated' }, { status: 403 })
        }

        // Generate our own JWT token for API access
        const token = generateToken({
            userId: user.id,
            firebaseUid: user.firebaseUid,
            email: user.email,
            role: user.role,
            department: user.department
        })

        return NextResponse.json({
            user: {
                id: user.id,
                firebaseUid: user.firebaseUid,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                name: `${user.firstName} ${user.lastName}`,
                phone: user.phone,
                role: user.role,
                department: user.department,
                authProvider: user.authProvider,
                emailVerified: user.emailVerified,
                profileImage: user.profileImage,
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
            },
            token,
            message: 'Authentication successful'
        })

    } catch (error) {
        console.error('Firebase login error:', error)

        if (error instanceof Error) {
            return NextResponse.json({
                error: error.message.includes('Invalid Firebase token')
                    ? 'Invalid authentication token'
                    : 'Authentication failed'
            }, { status: 401 })
        }

        return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
}

