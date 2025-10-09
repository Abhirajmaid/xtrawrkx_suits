/**
 * Mock data fixtures for MSW handlers
 */

import { Role, ProjectStatus, TaskStatus, TaskSource, MembershipStatus, CommunityTier } from '../types.js';

// ============================================================================
// Users
// ============================================================================

export const mockUsers = [
    {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: Role.CLIENT,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
        createdAt: '2024-01-15T10:00:00Z'
    },
    {
        id: 'user-2',
        name: 'Jane Smith',
        email: 'jane@xtrawrkx.com',
        role: Role.INTERNAL,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
        createdAt: '2024-01-10T10:00:00Z'
    },
    {
        id: 'user-3',
        name: 'Alex Johnson',
        email: 'alex@startup.com',
        role: Role.CLIENT,
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
        createdAt: '2024-02-01T10:00:00Z'
    }
];

// ============================================================================
// Communities
// ============================================================================

export const mockCommunities = [
    {
        id: 'comm-1',
        name: 'XEN',
        slug: 'xen',
        category: 'Entrepreneurship',
        membersCount: 1247,
        keyFeatures: [
            'Early-stage startup support',
            'Founder mentorship network',
            'Product development guidance',
            'Go-to-market strategies'
        ],
        meetingSchedule: 'Every Tuesday 7PM EST',
        joinProcess: 'Application review + founder interview',
        description: 'For early-stage entrepreneurs building the next big thing',
        icon: '🚀',
        color: 'bg-blue-500',
        freeTier: true
    },
    {
        id: 'comm-2',
        name: 'XEV.FiN',
        slug: 'xev-fin',
        category: 'Finance & Investment',
        membersCount: 523,
        keyFeatures: [
            'Investor matchmaking',
            'Pitch deck reviews',
            'Due diligence support',
            'Cap table guidance'
        ],
        meetingSchedule: 'Monthly investor meetups',
        joinProcess: 'Business validation + financial audit',
        description: 'Connect with investors and raise capital for your startup',
        icon: '💰',
        color: 'bg-green-500',
        freeTier: false
    },
    {
        id: 'comm-3',
        name: 'XEVTG',
        slug: 'xevtg',
        category: 'Technology & Talent',
        membersCount: 2156,
        keyFeatures: [
            'Tech talent marketplace',
            'Skill-based matching',
            'Project collaboration',
            'Career development'
        ],
        meetingSchedule: 'Weekly tech talks Wednesday 6PM',
        joinProcess: 'Portfolio review + technical interview',
        description: 'Tech talent marketplace for professionals and companies',
        icon: '💼',
        color: 'bg-purple-500',
        freeTier: true
    },
    {
        id: 'comm-4',
        name: 'xD&D',
        slug: 'xdd',
        category: 'Design & Development',
        membersCount: 891,
        keyFeatures: [
            'Design system collaboration',
            'Code review partnerships',
            'Creative showcases',
            'Technical workshops'
        ],
        meetingSchedule: 'Bi-weekly design sprints',
        joinProcess: 'Portfolio submission + peer review',
        description: 'Design & development community for creators',
        icon: '🎨',
        color: 'bg-pink-500',
        freeTier: true
    }
];

// ============================================================================
// Community Memberships
// ============================================================================

export const mockMemberships = [
    {
        id: 'membership-1',
        userId: 'user-1',
        communityId: 'comm-1',
        communitySlug: 'xen',
        tier: CommunityTier.X2,
        joinedAt: '2024-01-20T10:00:00Z',
        status: MembershipStatus.ACTIVE,
        canUpgrade: true,
        nextTier: CommunityTier.X3
    },
    {
        id: 'membership-2',
        userId: 'user-1',
        communityId: 'comm-3',
        communitySlug: 'xevtg',
        tier: CommunityTier.X1,
        joinedAt: '2024-02-15T10:00:00Z',
        status: MembershipStatus.ACTIVE,
        canUpgrade: true,
        nextTier: CommunityTier.X2
    },
    {
        id: 'membership-3',
        userId: 'user-3',
        communityId: 'comm-2',
        communitySlug: 'xev-fin',
        tier: CommunityTier.X3,
        joinedAt: '2024-02-05T10:00:00Z',
        status: MembershipStatus.ACTIVE,
        canUpgrade: true,
        nextTier: CommunityTier.X4
    }
];

// ============================================================================
// Service Records
// ============================================================================

export const mockServiceRecords = [
    {
        id: 'service-1',
        userId: 'user-1',
        communityId: 'comm-1',
        serviceName: 'Startup Accelerator',
        plan: 'Premium',
        startedAt: '2024-01-20T10:00:00Z',
        endedAt: null,
        notes: 'Full accelerator program with mentorship',
        isActive: true
    },
    {
        id: 'service-2',
        userId: 'user-1',
        communityId: 'comm-3',
        serviceName: 'Talent Matching',
        plan: 'Basic',
        startedAt: '2024-02-15T10:00:00Z',
        endedAt: '2024-09-15T10:00:00Z',
        notes: 'Found 2 developers for the team',
        isActive: false
    },
    {
        id: 'service-3',
        userId: 'user-3',
        communityId: 'comm-2',
        serviceName: 'Investment Readiness',
        plan: 'Enterprise',
        startedAt: '2024-02-05T10:00:00Z',
        endedAt: null,
        notes: 'Preparing for Series A round',
        isActive: true
    }
];

// ============================================================================
// Projects
// ============================================================================

export const mockProjects = [
    {
        id: 'project-1',
        communityId: 'comm-1',
        name: 'TechFlow MVP Development',
        status: ProjectStatus.ACTIVE,
        startDate: '2024-01-20T10:00:00Z',
        targetDate: '2024-12-31T23:59:59Z',
        createdById: 'user-1',
        description: 'Building the core MVP for our SaaS platform',
        progress: 65,
        risk: 'MEDIUM',
        createdAt: '2024-01-20T10:00:00Z'
    },
    {
        id: 'project-2',
        communityId: 'comm-2',
        name: 'Series A Fundraising',
        status: ProjectStatus.ACTIVE,
        startDate: '2024-02-05T10:00:00Z',
        targetDate: '2024-08-31T23:59:59Z',
        createdById: 'user-3',
        description: 'Raising $5M Series A to scale operations',
        progress: 40,
        risk: 'HIGH',
        createdAt: '2024-02-05T10:00:00Z'
    },
    {
        id: 'project-3',
        communityId: 'comm-3',
        name: 'Tech Team Expansion',
        status: ProjectStatus.COMPLETED,
        startDate: '2024-01-01T10:00:00Z',
        targetDate: '2024-06-30T23:59:59Z',
        createdById: 'user-1',
        description: 'Hiring 5 senior engineers',
        progress: 100,
        risk: 'LOW',
        createdAt: '2024-01-01T10:00:00Z'
    }
];

// ============================================================================
// Tasks
// ============================================================================

export const mockTasks = [
    // Project 1 Tasks (TechFlow MVP)
    {
        id: 'task-1',
        projectId: 'project-1',
        title: 'Set up development environment',
        description: 'Configure CI/CD pipeline and development tools',
        status: TaskStatus.DONE,
        source: TaskSource.CLIENT_PORTAL,
        createdById: 'user-1',
        assigneeId: 'user-2',
        dueDate: '2024-02-15T23:59:59Z',
        section: 'Setup',
        priority: 'HIGH',
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-02-10T14:30:00Z'
    },
    {
        id: 'task-2',
        projectId: 'project-1',
        title: 'Design user authentication system',
        description: 'Create login/signup flow with JWT tokens',
        status: TaskStatus.IN_PROGRESS,
        source: TaskSource.CLIENT_PORTAL,
        createdById: 'user-1',
        assigneeId: 'user-2',
        dueDate: '2024-10-15T23:59:59Z',
        section: 'Backend',
        priority: 'HIGH',
        createdAt: '2024-02-01T10:00:00Z',
        updatedAt: '2024-09-20T16:45:00Z'
    },
    {
        id: 'task-3',
        projectId: 'project-1',
        title: 'Implement payment processing',
        description: 'Integrate Stripe for subscription billing',
        status: TaskStatus.OPEN,
        source: TaskSource.INTERNAL_PM,
        createdById: 'user-2',
        assigneeId: null,
        dueDate: '2024-11-30T23:59:59Z',
        section: 'Backend',
        priority: 'MEDIUM',
        createdAt: '2024-02-15T10:00:00Z'
    },
    {
        id: 'task-4',
        projectId: 'project-1',
        title: 'Create dashboard wireframes',
        description: 'Design main dashboard layout and components',
        status: TaskStatus.DONE,
        source: TaskSource.CLIENT_PORTAL,
        createdById: 'user-1',
        assigneeId: 'user-1',
        dueDate: '2024-03-01T23:59:59Z',
        section: 'Design',
        priority: 'HIGH',
        createdAt: '2024-02-20T10:00:00Z',
        updatedAt: '2024-02-28T12:00:00Z'
    },
    {
        id: 'task-5',
        projectId: 'project-1',
        title: 'Mobile app responsive design',
        description: 'Ensure all components work on mobile devices',
        status: TaskStatus.OPEN,
        source: TaskSource.CLIENT_PORTAL,
        createdById: 'user-1',
        assigneeId: null,
        dueDate: '2024-12-15T23:59:59Z',
        section: 'Frontend',
        priority: 'MEDIUM',
        createdAt: '2024-09-25T10:00:00Z'
    },

    // Project 2 Tasks (Series A Fundraising)
    {
        id: 'task-6',
        projectId: 'project-2',
        title: 'Prepare pitch deck',
        description: 'Create compelling 15-slide investor presentation',
        status: TaskStatus.DONE,
        source: TaskSource.CLIENT_PORTAL,
        createdById: 'user-3',
        assigneeId: 'user-3',
        dueDate: '2024-03-15T23:59:59Z',
        section: 'Preparation',
        priority: 'HIGH',
        createdAt: '2024-02-05T10:00:00Z',
        updatedAt: '2024-03-10T15:20:00Z'
    },
    {
        id: 'task-7',
        projectId: 'project-2',
        title: 'Investor outreach campaign',
        description: 'Contact 50 VCs and schedule meetings',
        status: TaskStatus.IN_PROGRESS,
        source: TaskSource.INTERNAL_PM,
        createdById: 'user-2',
        assigneeId: 'user-3',
        dueDate: '2024-10-31T23:59:59Z',
        section: 'Outreach',
        priority: 'HIGH',
        createdAt: '2024-03-20T10:00:00Z',
        updatedAt: '2024-09-15T11:30:00Z'
    },
    {
        id: 'task-8',
        projectId: 'project-2',
        title: 'Financial projections model',
        description: 'Build 5-year revenue and expense projections',
        status: TaskStatus.BLOCKED,
        source: TaskSource.CLIENT_PORTAL,
        createdById: 'user-3',
        assigneeId: 'user-3',
        dueDate: '2024-10-01T23:59:59Z',
        section: 'Financials',
        priority: 'HIGH',
        createdAt: '2024-04-01T10:00:00Z'
    }
];

// ============================================================================
// Session User (current user)
// ============================================================================

export const mockSessionUser = {
    id: 'user-1',
    email: 'john@example.com',
    name: 'John Doe',
    role: Role.CLIENT,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    memberships: mockMemberships.filter(m => m.userId === 'user-1')
};

// ============================================================================
// Dashboard Data
// ============================================================================

export const mockDashboardData = {
    myTasks: {
        open: mockTasks.filter(t => t.createdById === 'user-1' && t.status === TaskStatus.OPEN).length,
        inProgress: mockTasks.filter(t => t.createdById === 'user-1' && t.status === TaskStatus.IN_PROGRESS).length,
        completed: mockTasks.filter(t => t.createdById === 'user-1' && t.status === TaskStatus.DONE).length,
        total: mockTasks.filter(t => t.createdById === 'user-1').length
    },
    projectTracker: mockProjects.map(project => ({
        ...project,
        tasksCount: mockTasks.filter(t => t.projectId === project.id).length,
        completedTasks: mockTasks.filter(t => t.projectId === project.id && t.status === TaskStatus.DONE).length
    })),
    upcoming: [
        {
            id: 'task-2',
            type: 'task',
            title: 'Design user authentication system',
            dueDate: '2024-10-15T23:59:59Z',
            projectName: 'TechFlow MVP Development'
        },
        {
            id: 'task-5',
            type: 'task',
            title: 'Mobile app responsive design',
            dueDate: '2024-12-15T23:59:59Z',
            projectName: 'TechFlow MVP Development'
        },
        {
            id: 'project-1',
            type: 'project',
            title: 'TechFlow MVP Development',
            dueDate: '2024-12-31T23:59:59Z',
            projectName: 'TechFlow MVP Development'
        }
    ]
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get user by ID
 * @param {string} id 
 * @returns {Object|null}
 */
export function getUserById(id) {
    return mockUsers.find(user => user.id === id) || null;
}

/**
 * Get community by ID
 * @param {string} id 
 * @returns {Object|null}
 */
export function getCommunityById(id) {
    return mockCommunities.find(community => community.id === id) || null;
}

/**
 * Get project by ID
 * @param {string} id 
 * @returns {Object|null}
 */
export function getProjectById(id) {
    return mockProjects.find(project => project.id === id) || null;
}

/**
 * Get task by ID
 * @param {string} id 
 * @returns {Object|null}
 */
export function getTaskById(id) {
    return mockTasks.find(task => task.id === id) || null;
}

/**
 * Filter tasks by visibility rules
 * @param {Object[]} tasks 
 * @param {string} userId 
 * @param {string} userRole 
 * @param {string} scope 
 * @returns {Object[]}
 */
export function filterTasksByVisibility(tasks, userId, userRole, scope = 'client') {
    if (userRole === Role.ADMIN) {
        return tasks; // Admins see everything
    }

    if (userRole === Role.INTERNAL) {
        if (scope === 'client') {
            return tasks.filter(task => task.source === TaskSource.CLIENT_PORTAL);
        } else if (scope === 'internal') {
            return tasks.filter(task => task.source === TaskSource.INTERNAL_PM);
        }
        return tasks; // Internal users see all by default
    }

    // CLIENT users only see tasks they created
    return tasks.filter(task => task.createdById === userId);
}

/**
 * Generate new ID
 * @param {string} prefix 
 * @returns {string}
 */
export function generateId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}


