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

// GET /api/users - Get all users
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const search = searchParams.get('search') || ''
        const role = searchParams.get('role') || ''
        const department = searchParams.get('department') || ''
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        // Build where clause
        const where: any = {
            AND: []
        }

        if (search) {
            where.AND.push({
                OR: [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ]
            })
        }

        if (role && role !== 'all') {
            where.AND.push({ role })
        }

        if (department && department !== 'all') {
            where.AND.push({ department })
        }

        // If no filters, remove AND clause
        if (where.AND.length === 0) {
            delete where.AND
        }

        const [users, total] = await Promise.all([
            prisma.xtrawrkxUser.findMany({
                where,
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
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.xtrawrkxUser.count({ where })
        ])

        return NextResponse.json({
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        }, { headers: corsHeaders })

    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders })
    }
}

// POST /api/users - Create new user
export async function POST(req: NextRequest) {
    try {
        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            role,
            department,
            isActive = true,
            authProvider = 'PASSWORD'
        } = await req.json()

        // Validation
        if (!firstName || !lastName || !email || !role || !department) {
            return NextResponse.json({
                error: 'First name, last name, email, role, and department are required'
            }, { status: 400, headers: corsHeaders })
        }

        // Check if user already exists
        const existingUser = await prisma.xtrawrkxUser.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({
                error: 'User with this email already exists'
            }, { status: 400, headers: corsHeaders })
        }

        // Hash password if provided
        let hashedPassword = null
        if (password && authProvider === 'PASSWORD') {
            hashedPassword = await hashPassword(password)
        }

        // Create user
        const user = await prisma.xtrawrkxUser.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                password: hashedPassword,
                role,
                department,
                isActive,
                authProvider,
                hiredDate: new Date(),
                emailVerified: authProvider === 'PASSWORD' ? false : true
            },
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
            }
        })

        return NextResponse.json({
            message: 'User created successfully',
            user
        }, { status: 201, headers: corsHeaders })

    } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders })
    }
}

