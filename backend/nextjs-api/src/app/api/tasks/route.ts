import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/middleware/auth'

// GET /api/tasks - Get all tasks for authenticated user
async function getTasks(req: NextRequest & { user: any }) {
    try {
        const { searchParams } = new URL(req.url)
        const projectId = searchParams.get('projectId')
        const status = searchParams.get('status')

        const where: any = {
            project: {
                members: {
                    some: {
                        userId: req.user.userId
                    }
                }
            }
        }

        if (projectId) {
            where.projectId = projectId
        }

        if (status) {
            where.status = status
        }

        const tasks = await prisma.task.findMany({
            where,
            include: {
                project: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({ tasks })
    } catch (error) {
        console.error('Get tasks error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/tasks - Create new task
async function createTask(req: NextRequest & { user: any }) {
    try {
        const { title, description, projectId, assigneeId, priority, dueDate } = await req.json()

        // Verify user has access to the project
        const projectMember = await prisma.projectMember.findFirst({
            where: {
                projectId,
                userId: req.user.userId
            }
        })

        if (!projectMember) {
            return NextResponse.json({ error: 'Access denied to project' }, { status: 403 })
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                projectId,
                assigneeId,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null
            },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        return NextResponse.json({ task }, { status: 201 })
    } catch (error) {
        console.error('Create task error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export const GET = withAuth(getTasks)
export const POST = withAuth(createTask)
