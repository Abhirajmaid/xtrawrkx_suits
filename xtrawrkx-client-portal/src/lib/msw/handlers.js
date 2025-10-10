/**
 * MSW handlers for API mocking
 */

import { http, HttpResponse } from 'msw';
import {
    mockUsers,
    mockCommunities,
    mockMemberships,
    mockServiceRecords,
    mockProjects,
    mockTasks,
    mockSessionUser,
    mockDashboardData,
    getUserById,
    getCommunityById,
    getProjectById,
    getTaskById,
    filterTasksByVisibility,
    generateId
} from './fixtures.js';
import { TaskSource, TaskStatus, Role } from '../types.js';

const baseURL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const apiPath = '/api';

// Helper to create API response
function createApiResponse(data, success = true, error = null, meta = {}) {
    return HttpResponse.json({
        data,
        success,
        error,
        meta
    });
}

// Helper to create paginated response
function createPaginatedResponse(data, page = 1, pageSize = 20, total = null) {
    const totalItems = total || data.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = data.slice(start, end);

    return HttpResponse.json({
        data: paginatedData,
        success: true,
        pagination: {
            page,
            pageSize,
            total: totalItems,
            totalPages: Math.ceil(totalItems / pageSize)
        }
    });
}

// Helper to simulate delay
function delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const handlers = [
    // ============================================================================
    // Authentication & Session
    // ============================================================================

    http.get(`${baseURL}${apiPath}/auth/me`, async () => {
        await delay(200);
        return createApiResponse(mockSessionUser);
    }),

    http.post(`${baseURL}${apiPath}/auth/local`, async ({ request }) => {
        await delay(500);
        const body = await request.json();

        // Simple mock login - always succeeds
        return createApiResponse({
            user: mockSessionUser,
            token: 'mock-jwt-token-' + Date.now()
        });
    }),

    http.post(`${baseURL}${apiPath}/auth/logout`, async () => {
        await delay(200);
        return createApiResponse({ success: true });
    }),

    // ============================================================================
    // Communities
    // ============================================================================

    http.get(`${baseURL}${apiPath}/communities`, async ({ request }) => {
        await delay(300);
        const url = new URL(request.url);
        const category = url.searchParams.get('category');
        const page = parseInt(url.searchParams.get('page') || '1');
        const pageSize = parseInt(url.searchParams.get('pageSize') || '20');

        let filteredCommunities = mockCommunities;

        if (category) {
            filteredCommunities = mockCommunities.filter(c => c.category === category);
        }

        return createPaginatedResponse(filteredCommunities, page, pageSize);
    }),

    http.get(`${baseURL}${apiPath}/communities/:id`, async ({ params }) => {
        await delay(200);
        const community = getCommunityById(params.id);

        if (!community) {
            return HttpResponse.json({ error: 'Community not found' }, { status: 404 });
        }

        return createApiResponse(community);
    }),

    // ============================================================================
    // Community Memberships
    // ============================================================================

    http.get(`${baseURL}${apiPath}/memberships`, async ({ request }) => {
        await delay(300);
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');
        const communityId = url.searchParams.get('communityId');
        const status = url.searchParams.get('status');
        const page = parseInt(url.searchParams.get('page') || '1');
        const pageSize = parseInt(url.searchParams.get('pageSize') || '20');

        let filteredMemberships = mockMemberships;

        if (userId) {
            filteredMemberships = filteredMemberships.filter(m => m.userId === userId);
        }
        if (communityId) {
            filteredMemberships = filteredMemberships.filter(m => m.communityId === communityId);
        }
        if (status) {
            filteredMemberships = filteredMemberships.filter(m => m.status === status);
        }

        return createPaginatedResponse(filteredMemberships, page, pageSize);
    }),

    http.post(`${baseURL}${apiPath}/memberships`, async ({ request }) => {
        await delay(500);
        const body = await request.json();

        const newMembership = {
            id: generateId('membership'),
            userId: mockSessionUser.id,
            communityId: body.communityId,
            communitySlug: getCommunityById(body.communityId)?.slug || 'unknown',
            tier: 'X0',
            joinedAt: new Date().toISOString(),
            status: 'ACTIVE',
            canUpgrade: true,
            nextTier: 'X1'
        };

        return createApiResponse(newMembership);
    }),

    http.put(`${baseURL}${apiPath}/memberships/:id`, async ({ params, request }) => {
        await delay(400);
        const body = await request.json();

        const membership = mockMemberships.find(m => m.id === params.id);
        if (!membership) {
            return HttpResponse.json({ error: 'Membership not found' }, { status: 404 });
        }

        const updatedMembership = {
            ...membership,
            ...body,
            updatedAt: new Date().toISOString()
        };

        return createApiResponse(updatedMembership);
    }),

    // ============================================================================
    // Service Records
    // ============================================================================

    http.get(`${baseURL}${apiPath}/service-records`, async ({ request }) => {
        await delay(300);
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');
        const communityId = url.searchParams.get('communityId');
        const isActive = url.searchParams.get('isActive');
        const page = parseInt(url.searchParams.get('page') || '1');
        const pageSize = parseInt(url.searchParams.get('pageSize') || '20');

        let filteredRecords = mockServiceRecords;

        if (userId) {
            filteredRecords = filteredRecords.filter(r => r.userId === userId);
        }
        if (communityId) {
            filteredRecords = filteredRecords.filter(r => r.communityId === communityId);
        }
        if (isActive !== null) {
            filteredRecords = filteredRecords.filter(r => r.isActive === (isActive === 'true'));
        }

        return createPaginatedResponse(filteredRecords, page, pageSize);
    }),

    // ============================================================================
    // Projects
    // ============================================================================

    http.get(`${baseURL}${apiPath}/projects`, async ({ request }) => {
        await delay(300);
        const url = new URL(request.url);
        const communityId = url.searchParams.get('communityId');
        const status = url.searchParams.get('status');
        const page = parseInt(url.searchParams.get('page') || '1');
        const pageSize = parseInt(url.searchParams.get('pageSize') || '20');

        let filteredProjects = mockProjects;

        if (communityId) {
            filteredProjects = filteredProjects.filter(p => p.communityId === communityId);
        }
        if (status) {
            filteredProjects = filteredProjects.filter(p => p.status === status);
        }

        return createPaginatedResponse(filteredProjects, page, pageSize);
    }),

    http.get(`${baseURL}${apiPath}/projects/:id`, async ({ params }) => {
        await delay(200);
        const project = getProjectById(params.id);

        if (!project) {
            return HttpResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return createApiResponse(project);
    }),

    http.post(`${baseURL}${apiPath}/projects`, async ({ request }) => {
        await delay(600);
        const body = await request.json();

        const newProject = {
            id: generateId('project'),
            communityId: body.communityId,
            name: body.name,
            status: 'ACTIVE',
            startDate: body.startDate || new Date().toISOString(),
            targetDate: body.targetDate,
            createdById: mockSessionUser.id,
            description: body.description || '',
            progress: 0,
            risk: 'LOW',
            createdAt: new Date().toISOString()
        };

        return createApiResponse(newProject);
    }),

    http.put(`${baseURL}${apiPath}/projects/:id`, async ({ params, request }) => {
        await delay(400);
        const body = await request.json();

        const project = getProjectById(params.id);
        if (!project) {
            return HttpResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        const updatedProject = {
            ...project,
            ...body,
            updatedAt: new Date().toISOString()
        };

        return createApiResponse(updatedProject);
    }),

    // ============================================================================
    // Tasks
    // ============================================================================

    http.get(`${baseURL}${apiPath}/tasks`, async ({ request }) => {
        await delay(300);
        const url = new URL(request.url);
        const projectId = url.searchParams.get('projectId');
        const scope = url.searchParams.get('scope') || 'client';
        const status = url.searchParams.get('status');
        const assigneeId = url.searchParams.get('assigneeId');
        const section = url.searchParams.get('section');
        const page = parseInt(url.searchParams.get('page') || '1');
        const pageSize = parseInt(url.searchParams.get('pageSize') || '20');

        let filteredTasks = mockTasks;

        if (projectId) {
            filteredTasks = filteredTasks.filter(t => t.projectId === projectId);
        }
        if (status) {
            filteredTasks = filteredTasks.filter(t => t.status === status);
        }
        if (assigneeId) {
            filteredTasks = filteredTasks.filter(t => t.assigneeId === assigneeId);
        }
        if (section) {
            filteredTasks = filteredTasks.filter(t => t.section === section);
        }

        // Apply visibility filters
        filteredTasks = filterTasksByVisibility(
            filteredTasks,
            mockSessionUser.id,
            mockSessionUser.role,
            scope
        );

        return createPaginatedResponse(filteredTasks, page, pageSize);
    }),

    http.get(`${baseURL}${apiPath}/tasks/:id`, async ({ params }) => {
        await delay(200);
        const task = getTaskById(params.id);

        if (!task) {
            return HttpResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        // Check visibility permissions
        if (mockSessionUser.role === Role.CLIENT && task.createdById !== mockSessionUser.id) {
            return HttpResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        return createApiResponse(task);
    }),

    http.post(`${baseURL}${apiPath}/tasks`, async ({ request }) => {
        await delay(500);
        const body = await request.json();

        const newTask = {
            id: generateId('task'),
            projectId: body.projectId,
            title: body.title,
            description: body.description || '',
            status: TaskStatus.OPEN,
            source: TaskSource.CLIENT_PORTAL,
            createdById: mockSessionUser.id,
            assigneeId: body.assigneeId || null,
            dueDate: body.dueDate || null,
            section: body.section || 'General',
            priority: body.priority || 'MEDIUM',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        return createApiResponse(newTask);
    }),

    http.put(`${baseURL}${apiPath}/tasks/:id`, async ({ params, request }) => {
        await delay(400);
        const body = await request.json();

        const task = getTaskById(params.id);
        if (!task) {
            return HttpResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        // Check permissions - clients can only update their own tasks
        if (mockSessionUser.role === Role.CLIENT && task.createdById !== mockSessionUser.id) {
            return HttpResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const updatedTask = {
            ...task,
            ...body,
            updatedAt: new Date().toISOString()
        };

        return createApiResponse(updatedTask);
    }),

    http.delete(`${baseURL}${apiPath}/tasks/:id`, async ({ params }) => {
        await delay(300);
        const task = getTaskById(params.id);

        if (!task) {
            return HttpResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        // Check permissions - clients can only delete their own tasks
        if (mockSessionUser.role === Role.CLIENT && task.createdById !== mockSessionUser.id) {
            return HttpResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        return createApiResponse({ success: true });
    }),

    // ============================================================================
    // Onboarding
    // ============================================================================

    http.post(`${baseURL}${apiPath}/onboarding/complete`, async ({ request }) => {
        await delay(800);
        const body = await request.json();

        // Create a new project based on onboarding data
        const newProject = {
            id: generateId('project'),
            communityId: body.selectedCommunities?.[0] || 'comm-1',
            name: body.projectName || 'Onboarding Project',
            status: 'ACTIVE',
            startDate: new Date().toISOString(),
            targetDate: body.targetDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            createdById: mockSessionUser.id,
            description: body.projectDescription || 'Project created from onboarding',
            progress: 0,
            risk: 'LOW',
            createdAt: new Date().toISOString()
        };

        // Create initial kickoff task
        const kickoffTask = {
            id: generateId('task'),
            projectId: newProject.id,
            title: 'Project Kickoff',
            description: 'Welcome to your new project! This task was automatically created to get you started.',
            status: TaskStatus.OPEN,
            source: TaskSource.CLIENT_PORTAL,
            createdById: mockSessionUser.id,
            assigneeId: mockSessionUser.id,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            section: 'Getting Started',
            priority: 'HIGH',
            createdAt: new Date().toISOString()
        };

        return createApiResponse({
            project: newProject,
            initialTask: kickoffTask,
            message: 'Onboarding completed successfully!'
        });
    }),

    // ============================================================================
    // Dashboard & Analytics
    // ============================================================================

    http.get(`${baseURL}${apiPath}/dashboard`, async ({ request }) => {
        await delay(400);
        const url = new URL(request.url);
        const communityId = url.searchParams.get('communityId');

        // Filter data by community if specified
        let dashboardData = { ...mockDashboardData };

        if (communityId) {
            dashboardData.projectTracker = dashboardData.projectTracker.filter(
                p => p.communityId === communityId
            );
        }

        return createApiResponse(dashboardData);
    }),

    http.get(`${baseURL}${apiPath}/dashboard/my-tasks`, async () => {
        await delay(300);

        const myTasks = mockTasks.filter(t => t.createdById === mockSessionUser.id);
        const summary = {
            open: myTasks.filter(t => t.status === TaskStatus.OPEN).length,
            inProgress: myTasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
            blocked: myTasks.filter(t => t.status === TaskStatus.BLOCKED).length,
            completed: myTasks.filter(t => t.status === TaskStatus.DONE).length,
            total: myTasks.length,
            recentTasks: myTasks.slice(0, 5)
        };

        return createApiResponse(summary);
    }),

    http.get(`${baseURL}${apiPath}/dashboard/project-tracker`, async ({ request }) => {
        await delay(300);
        const url = new URL(request.url);
        const communityId = url.searchParams.get('communityId');

        let projects = mockProjects;
        if (communityId) {
            projects = projects.filter(p => p.communityId === communityId);
        }

        const projectSummaries = projects.map(project => {
            const projectTasks = mockTasks.filter(t => t.projectId === project.id);
            const completedTasks = projectTasks.filter(t => t.status === TaskStatus.DONE);

            return {
                ...project,
                tasksCount: projectTasks.length,
                completedTasks: completedTasks.length,
                tasksProgress: projectTasks.length > 0 ? Math.round((completedTasks.length / projectTasks.length) * 100) : 0
            };
        });

        return createApiResponse(projectSummaries);
    }),

    http.get(`${baseURL}${apiPath}/dashboard/upcoming`, async ({ request }) => {
        await delay(250);
        const url = new URL(request.url);
        const days = parseInt(url.searchParams.get('days') || '14');

        const now = new Date();
        const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

        // Get upcoming tasks
        const upcomingTasks = mockTasks
            .filter(task => {
                if (!task.dueDate) return false;
                const dueDate = new Date(task.dueDate);
                return dueDate >= now && dueDate <= futureDate;
            })
            .map(task => ({
                ...task,
                type: 'task',
                projectName: getProjectById(task.projectId)?.name || 'Unknown Project'
            }));

        // Get upcoming project deadlines
        const upcomingProjects = mockProjects
            .filter(project => {
                if (!project.targetDate) return false;
                const targetDate = new Date(project.targetDate);
                return targetDate >= now && targetDate <= futureDate;
            })
            .map(project => ({
                ...project,
                type: 'project',
                dueDate: project.targetDate,
                projectName: project.name
            }));

        const upcoming = [...upcomingTasks, ...upcomingProjects]
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        return createApiResponse(upcoming);
    })
];

export default handlers;


