import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, generateToken } from '@/lib/auth'
import { withCors } from '@/lib/cors'

export const OPTIONS = withCors(async (request: NextRequest) => {
    return new NextResponse(null, { status: 200 })
})

export const POST = withCors(async (req: NextRequest) => {
    try {
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
        }

        // Find user in XtrawrkxUser table
        const user = await prisma.xtrawrkxUser.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                department: true,
                password: true,
                phone: true,
                authProvider: true,
                emailVerified: true,
                isActive: true,
                createdAt: true,
            }
        })

        if (!user || !user.isActive) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        // Check if user is Firebase-only (no password set)
        if (user.authProvider === 'FIREBASE' && !user.password) {
            return NextResponse.json({
                error: 'This account uses Firebase authentication. Please use the Firebase login method.',
                authProvider: 'FIREBASE'
            }, { status: 400 })
        }

        // Check password for password-based or hybrid users
        if (!user.password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const isValidPassword = await comparePassword(password, user.password)

        if (!isValidPassword) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        // Update last login
        await prisma.xtrawrkxUser.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
        })

        // Generate token
        const token = generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            department: user.department
        })

        const userResponse = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            name: `${user.firstName} ${user.lastName}`,
            phone: user.phone,
            role: user.role,
            department: user.department,
            authProvider: user.authProvider,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
        }

        return NextResponse.json({
            user: userResponse,
            token
        })

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
})