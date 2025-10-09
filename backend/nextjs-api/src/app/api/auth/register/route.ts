import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken, comparePassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        const { email, password, name } = await req.json()

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 })
        }

        // Hash password and create user
        const hashedPassword = await hashPassword(password)

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
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
            token
        }, { status: 201 })

    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
