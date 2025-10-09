import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

// Add CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:3003',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, { status: 200, headers: corsHeaders })
}

// GET /api/users/[id] - Get single user
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params

        const user = await prisma.xtrawrkxUser.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                department: true,
                isActive: true,
                profileImage: true,
                hiredDate: true,
                lastLoginAt: true,
                authProvider: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404, headers: corsHeaders })
        }

        return NextResponse.json({ user }, { headers: corsHeaders })

    } catch (error) {
        console.error('Error fetching user:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders })
    }
}

// PUT /api/users/[id] - Update user
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            role,
            department,
            isActive
        } = await req.json()

        // Check if user exists
        const existingUser = await prisma.xtrawrkxUser.findUnique({
            where: { id }
        })

        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404, headers: corsHeaders })
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== existingUser.email) {
            const emailExists = await prisma.xtrawrkxUser.findUnique({
                where: { email }
            })

            if (emailExists) {
                return NextResponse.json({
                    error: 'Email is already taken by another user'
                }, { status: 400, headers: corsHeaders })
            }
        }

        // Prepare update data
        const updateData: any = {}
        if (firstName !== undefined) updateData.firstName = firstName
        if (lastName !== undefined) updateData.lastName = lastName
        if (email !== undefined) updateData.email = email
        if (phone !== undefined) updateData.phone = phone
        if (role !== undefined) updateData.role = role
        if (department !== undefined) updateData.department = department
        if (isActive !== undefined) updateData.isActive = isActive

        // Hash password if provided
        if (password) {
            updateData.password = await hashPassword(password)
        }

        // Update user
        const user = await prisma.xtrawrkxUser.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                department: true,
                isActive: true,
                profileImage: true,
                hiredDate: true,
                authProvider: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
            }
        })

        return NextResponse.json({
            message: 'User updated successfully',
            user
        }, { headers: corsHeaders })

    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders })
    }
}

// DELETE /api/users/[id] - Delete user
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params

        // Check if user exists
        const existingUser = await prisma.xtrawrkxUser.findUnique({
            where: { id }
        })

        if (!existingUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404, headers: corsHeaders })
        }

        // Instead of hard delete, we'll soft delete by setting isActive to false
        const user = await prisma.xtrawrkxUser.update({
            where: { id },
            data: { isActive: false },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                isActive: true,
            }
        })

        return NextResponse.json({
            message: 'User deactivated successfully',
            user
        }, { headers: corsHeaders })

    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders })
    }
}

