import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'

// POST /api/auth/verify-otp - Verify OTP and create user account
export async function POST(req: NextRequest) {
    try {
        const { email, phone, otp, name } = await req.json()

        if (!email || !phone || !otp) {
            return NextResponse.json({ error: 'Email, phone, and OTP are required' }, { status: 400 })
        }

        // For development, accept the temporary OTP
        const validOTP = '123456'
        if (otp !== validOTP) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 })
        }

        // Create user account (no password needed for OTP-based registration)
        // We'll generate a random password that they can change later if needed
        const randomPassword = Math.random().toString(36).substring(2, 15)
        const hashedPassword = await hashPassword(randomPassword)

        const user = await prisma.user.create({
            data: {
                email,
                phone,
                name: name || '',
                password: hashedPassword,
                // New users need onboarding
                onboarded: false,
                needsOnboarding: true,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                createdAt: true,
                onboarded: true,
                needsOnboarding: true,
            }
        })

        // Generate token
        const token = generateToken({ userId: user.id, email: user.email, role: user.role })

        return NextResponse.json({
            user,
            token,
            message: 'Account created successfully'
        }, { status: 201 })

    } catch (error) {
        console.error('Verify OTP error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
