import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/middleware/auth'

// GET /api/projects - Get all projects for authenticated user
async function getProjects(req: NextRequest & { user: any }) {
    try {
        const projects = await prisma.project.findMany({
            where: {
                members: {
                    some: {
                        userId: req.user.userId
                    }
                }
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true
                            }
                        }
                    }
                },
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        priority: true,
                        dueDate: true
                    }
                },
                _count: {
                    select: {
                        tasks: true,
                        files: true
                    }
                }
            }
        })

        return NextResponse.json({ projects })
    } catch (error) {
        console.error('Get projects error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/projects - Create new project
async function createProject(req: NextRequest & { user: any }) {
    try {
        const { name, description } = await req.json()

        const project = await prisma.project.create({
            data: {
                name,
                description,
                members: {
                    create: {
                        userId: req.user.userId,
                        role: 'OWNER'
                    }
                }
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                role: true
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json({ project }, { status: 201 })
    } catch (error) {
        console.error('Create project error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export const GET = withAuth(getProjects)
export const POST = withAuth(createProject)
