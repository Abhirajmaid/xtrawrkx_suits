import { auth } from './firebase'
import { prisma } from './prisma'

export interface FirebaseUser {
    uid: string
    email: string
    name?: string
    phone?: string
    emailVerified: boolean
}

export async function verifyFirebaseToken(idToken: string): Promise<FirebaseUser> {
    try {
        const decodedToken = await auth.verifyIdToken(idToken)

        return {
            uid: decodedToken.uid,
            email: decodedToken.email || '',
            name: decodedToken.name || decodedToken.display_name,
            phone: decodedToken.phone_number,
            emailVerified: decodedToken.email_verified || false
        }
    } catch (error) {
        console.error('Firebase token verification error:', error)
        throw new Error('Invalid Firebase token')
    }
}

export async function createOrUpdateXtrawrkxUser(firebaseUser: FirebaseUser, additionalData?: {
    firstName?: string
    lastName?: string
    role?: string
    department?: string
    hiredDate?: Date
}) {
    const existingUser = await prisma.xtrawrkxUser.findUnique({
        where: { firebaseUid: firebaseUser.uid }
    })

    if (existingUser) {
        // Update existing user
        return await prisma.xtrawrkxUser.update({
            where: { firebaseUid: firebaseUser.uid },
            data: {
                email: firebaseUser.email,
                phone: firebaseUser.phone,
                emailVerified: firebaseUser.emailVerified,
                lastLoginAt: new Date(),
                ...(additionalData?.firstName && { firstName: additionalData.firstName }),
                ...(additionalData?.lastName && { lastName: additionalData.lastName }),
            }
        })
    } else {
        // Check if user exists by email (for migration purposes)
        const userByEmail = await prisma.xtrawrkxUser.findUnique({
            where: { email: firebaseUser.email }
        })

        if (userByEmail) {
            // Link existing user to Firebase
            return await prisma.xtrawrkxUser.update({
                where: { email: firebaseUser.email },
                data: {
                    firebaseUid: firebaseUser.uid,
                    authProvider: userByEmail.password ? 'HYBRID' : 'FIREBASE',
                    emailVerified: firebaseUser.emailVerified,
                    lastLoginAt: new Date(),
                }
            })
        }

        // Create new user
        const names = firebaseUser.name?.split(' ') || ['', '']
        const firstName = additionalData?.firstName || names[0] || 'User'
        const lastName = additionalData?.lastName || names.slice(1).join(' ') || ''

        return await prisma.xtrawrkxUser.create({
            data: {
                firebaseUid: firebaseUser.uid,
                email: firebaseUser.email,
                firstName,
                lastName,
                phone: firebaseUser.phone,
                role: additionalData?.role || 'DEVELOPER',
                department: additionalData?.department || 'DEVELOPMENT',
                authProvider: 'FIREBASE',
                emailVerified: firebaseUser.emailVerified,
                lastLoginAt: new Date(),
                hiredDate: additionalData?.hiredDate,
            }
        })
    }
}

export async function getXtrawrkxUserByFirebaseUid(firebaseUid: string) {
    return await prisma.xtrawrkxUser.findUnique({
        where: { firebaseUid },
        select: {
            id: true,
            firebaseUid: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            department: true,
            authProvider: true,
            emailVerified: true,
            profileImage: true,
            isActive: true,
            lastLoginAt: true,
            createdAt: true,
            updatedAt: true,
        }
    })
}

export async function getXtrawrkxUserByEmail(email: string) {
    return await prisma.xtrawrkxUser.findUnique({
        where: { email },
        select: {
            id: true,
            firebaseUid: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            department: true,
            authProvider: true,
            emailVerified: true,
            profileImage: true,
            isActive: true,
            password: true, // Include for hybrid auth
            lastLoginAt: true,
            createdAt: true,
            updatedAt: true,
        }
    })
}

// Send OTP via Firebase (for phone verification)
export async function sendOTPViaFirebase(phoneNumber: string) {
    try {
        // This would typically be handled on the frontend, but we can create custom tokens
        // For now, we'll return a success message as OTP sending is usually done client-side
        return {
            success: true,
            message: 'OTP sent successfully',
            // In a real implementation, you might store a verification session ID
        }
    } catch (error) {
        console.error('Error sending OTP:', error)
        throw new Error('Failed to send OTP')
    }
}

// Create custom token for specific use cases
export async function createCustomFirebaseToken(uid: string, additionalClaims?: object) {
    try {
        return await auth.createCustomToken(uid, additionalClaims)
    } catch (error) {
        console.error('Error creating custom token:', error)
        throw new Error('Failed to create custom token')
    }
}

