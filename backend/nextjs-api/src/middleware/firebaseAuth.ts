import { NextRequest, NextResponse } from 'next/server'
import { verifyFirebaseToken, getXtrawrkxUserByFirebaseUid } from '@/lib/firebaseAuth'
import { verifyToken } from '@/lib/auth'

export function withFirebaseAuth(handler: (req: NextRequest & { user: any }) => Promise<NextResponse>) {
    return async (req: NextRequest) => {
        try {
            const authHeader = req.headers.get('authorization')

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
            }

            const token = authHeader.substring(7) // Remove 'Bearer ' prefix

            try {
                // Try Firebase token first
                const firebaseUser = await verifyFirebaseToken(token)

                // Get user from database
                const dbUser = await getXtrawrkxUserByFirebaseUid(firebaseUser.uid)

                if (!dbUser || !dbUser.isActive) {
                    return NextResponse.json({ error: 'User not found or inactive' }, { status: 401 })
                }

                // Add user info to request
                const reqWithUser = Object.assign(req, {
                    user: {
                        userId: dbUser.id,
                        firebaseUid: dbUser.firebaseUid,
                        email: dbUser.email,
                        firstName: dbUser.firstName,
                        lastName: dbUser.lastName,
                        role: dbUser.role,
                        department: dbUser.department,
                        authProvider: 'FIREBASE'
                    }
                })

                return await handler(reqWithUser as NextRequest & { user: any })

            } catch (firebaseError) {
                // If Firebase token fails, try JWT token (for backward compatibility)
                try {
                    const jwtPayload = verifyToken(token)

                    // Add user info to request (assuming JWT contains user info)
                    const reqWithUser = Object.assign(req, {
                        user: {
                            userId: jwtPayload.userId,
                            email: jwtPayload.email,
                            role: jwtPayload.role,
                            authProvider: 'JWT'
                        }
                    })

                    return await handler(reqWithUser as NextRequest & { user: any })

                } catch (jwtError) {
                    console.error('Both Firebase and JWT token verification failed:', { firebaseError, jwtError })
                    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
                }
            }

        } catch (error) {
            console.error('Auth middleware error:', error)
            return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
        }
    }
}

// Middleware specifically for Firebase-only authentication
export function withFirebaseAuthOnly(handler: (req: NextRequest & { user: any }) => Promise<NextResponse>) {
    return async (req: NextRequest) => {
        try {
            const authHeader = req.headers.get('authorization')

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return NextResponse.json({ error: 'Authorization header required' }, { status: 401 })
            }

            const token = authHeader.substring(7)

            // Verify Firebase token
            const firebaseUser = await verifyFirebaseToken(token)

            // Get user from database
            const dbUser = await getXtrawrkxUserByFirebaseUid(firebaseUser.uid)

            if (!dbUser || !dbUser.isActive) {
                return NextResponse.json({ error: 'User not found or inactive' }, { status: 401 })
            }

            // Add user info to request
            const reqWithUser = Object.assign(req, {
                user: {
                    userId: dbUser.id,
                    firebaseUid: dbUser.firebaseUid,
                    email: dbUser.email,
                    firstName: dbUser.firstName,
                    lastName: dbUser.lastName,
                    role: dbUser.role,
                    department: dbUser.department,
                    authProvider: 'FIREBASE'
                }
            })

            return await handler(reqWithUser as NextRequest & { user: any })

        } catch (error) {
            console.error('Firebase auth middleware error:', error)
            return NextResponse.json({ error: 'Invalid Firebase token' }, { status: 401 })
        }
    }
}

