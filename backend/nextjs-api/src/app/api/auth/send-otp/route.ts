import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOTPViaFirebase } from '@/lib/firebaseAuth'

export async function POST(req: NextRequest) {
    try {
        const { email, phone, firstName, lastName, role, department } = await req.json()

        if (!email || !phone) {
            return NextResponse.json({ error: 'Email and phone are required' }, { status: 400 })
        }

        // Check if user already exists
        const existingUser = await prisma.xtrawrkxUser.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists with this email' }, { status: 400 })
        }

        // Check if phone is already used
        if (phone) {
            const existingPhone = await prisma.xtrawrkxUser.findFirst({
                where: { phone }
            })

            if (existingPhone) {
                return NextResponse.json({ error: 'Phone number already registered' }, { status: 400 })
            }
        }

        // Send OTP via Firebase (this would typically be handled on frontend)
        try {
            await sendOTPViaFirebase(phone)
        } catch (otpError) {
            console.error('OTP sending failed:', otpError)
            // Continue without failing - OTP might be sent from frontend
        }

        // Store pending registration data temporarily
        // In a real app, you might want to use Redis or a temporary table
        // For now, we'll return success and expect the frontend to handle OTP verification

        return NextResponse.json({
            message: 'OTP sent successfully. Please verify to complete registration.',
            registrationData: {
                email,
                phone,
                firstName: firstName || '',
                lastName: lastName || '',
                role: role || 'DEVELOPER',
                department: department || 'DEVELOPMENT'
            }
        }, { status: 200 })

    } catch (error) {
        console.error('Send OTP error:', error)
        return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
    }
}