import { z } from 'zod';
import { Role, ProjectStatus, TaskStatus, TaskSource, MembershipStatus, CommunityTier } from './types.js';

// Base schemas
export const idSchema = z.string().min(1);
export const isoDateSchema = z.string().datetime();

// Enum schemas
export const roleSchema = z.enum([Role.CLIENT, Role.INTERNAL, Role.ADMIN]);
export const projectStatusSchema = z.enum([
    ProjectStatus.ACTIVE,
    ProjectStatus.ON_HOLD,
    ProjectStatus.COMPLETED,
    ProjectStatus.ARCHIVED
]);
export const taskStatusSchema = z.enum([
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.BLOCKED,
    TaskStatus.DONE,
    TaskStatus.CANCELED
]);
export const taskSourceSchema = z.enum([
    TaskSource.CLIENT_PORTAL,
    TaskSource.INTERNAL_PM,
    TaskSource.IMPORT,
    TaskSource.API
]);
export const membershipStatusSchema = z.enum([
    MembershipStatus.ACTIVE,
    MembershipStatus.PAUSED,
    MembershipStatus.CANCELED
]);
export const communityTierSchema = z.enum([
    CommunityTier.X0,
    CommunityTier.X1,
    CommunityTier.X2,
    CommunityTier.X3,
    CommunityTier.X4,
    CommunityTier.X5
]);

// DTO Schemas
export const userSchema = z.object({
    id: idSchema,
    name: z.string().optional(),
    email: z.string().email(),
    role: roleSchema,
    avatarUrl: z.string().url().optional(),
    createdAt: isoDateSchema.optional()
});

export const communitySchema = z.object({
    id: idSchema,
    name: z.string(),
    slug: z.string(),
    category: z.string().optional(),
    membersCount: z.number().optional(),
    keyFeatures: z.array(z.string()).optional(),
    meetingSchedule: z.string().optional(),
    joinProcess: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
    freeTier: z.boolean().optional()
});

export const communityMembershipSchema = z.object({
    id: idSchema,
    userId: idSchema,
    communityId: idSchema,
    communitySlug: z.string(),
    tier: communityTierSchema.optional(),
    joinedAt: isoDateSchema,
    status: membershipStatusSchema,
    canUpgrade: z.boolean().optional(),
    nextTier: communityTierSchema.optional()
});

export const serviceRecordSchema = z.object({
    id: idSchema,
    userId: idSchema,
    communityId: idSchema,
    serviceName: z.string(),
    plan: z.string(),
    startedAt: isoDateSchema,
    endedAt: isoDateSchema.optional(),
    notes: z.string().optional(),
    isActive: z.boolean().optional()
});

export const projectSchema = z.object({
    id: idSchema,
    communityId: idSchema,
    name: z.string(),
    status: projectStatusSchema,
    startDate: isoDateSchema.optional(),
    targetDate: isoDateSchema.optional(),
    createdById: idSchema.optional(),
    description: z.string().optional(),
    progress: z.number().min(0).max(100).optional(),
    risk: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
    createdAt: isoDateSchema.optional()
});

export const taskSchema = z.object({
    id: idSchema,
    projectId: idSchema,
    title: z.string(),
    description: z.string().optional(),
    status: taskStatusSchema,
    source: taskSourceSchema,
    createdById: idSchema,
    assigneeId: idSchema.optional(),
    dueDate: isoDateSchema.optional(),
    section: z.string().optional(),
    customFields: z.record(z.any()).optional(),
    parentTaskId: idSchema.optional(),
    dependencyIds: z.array(idSchema).optional(),
    priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
    createdAt: isoDateSchema,
    updatedAt: isoDateSchema.optional()
});

export const taskVisibilitySchema = z.object({
    id: idSchema,
    taskId: idSchema,
    userId: idSchema
});

export const onboardingSchema = z.object({
    id: idSchema,
    userId: idSchema,
    step: z.string(),
    data: z.record(z.any()),
    completed: z.boolean(),
    completedAt: isoDateSchema.optional(),
    createdAt: isoDateSchema,
    updatedAt: isoDateSchema
});

export const sessionUserSchema = z.object({
    id: idSchema,
    email: z.string().email(),
    name: z.string().optional(),
    role: roleSchema,
    avatarUrl: z.string().url().optional(),
    memberships: z.array(communityMembershipSchema)
});

// Request/Response schemas
export const apiResponseSchema = (dataSchema) => z.object({
    data: dataSchema,
    success: z.boolean(),
    error: z.string().optional(),
    meta: z.record(z.any()).optional()
});

export const paginatedResponseSchema = (itemSchema) => z.object({
    data: z.array(itemSchema),
    success: z.boolean(),
    pagination: z.object({
        page: z.number(),
        pageSize: z.number(),
        total: z.number(),
        totalPages: z.number()
    })
});

// Create task request
export const createTaskRequestSchema = z.object({
    projectId: idSchema,
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    dueDate: isoDateSchema.optional(),
    section: z.string().optional(),
    priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
    assigneeId: idSchema.optional()
});

// Create project request  
export const createProjectRequestSchema = z.object({
    communityId: idSchema,
    name: z.string().min(1, 'Project name is required'),
    description: z.string().optional(),
    startDate: isoDateSchema.optional(),
    targetDate: isoDateSchema.optional()
});

// Update task request
export const updateTaskRequestSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    status: taskStatusSchema.optional(),
    dueDate: isoDateSchema.optional(),
    section: z.string().optional(),
    priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
    assigneeId: idSchema.optional()
});

// Query parameter schemas
export const tasksQuerySchema = z.object({
    projectId: idSchema.optional(),
    scope: z.enum(['client', 'internal', 'all']).optional(),
    status: taskStatusSchema.optional(),
    assigneeId: idSchema.optional(),
    section: z.string().optional(),
    page: z.number().optional(),
    pageSize: z.number().optional()
});

export const projectsQuerySchema = z.object({
    communityId: idSchema.optional(),
    status: projectStatusSchema.optional(),
    page: z.number().optional(),
    pageSize: z.number().optional()
});

export const communitiesQuerySchema = z.object({
    category: z.string().optional(),
    page: z.number().optional(),
    pageSize: z.number().optional()
});

export const membershipsQuerySchema = z.object({
    userId: idSchema.optional(),
    communityId: idSchema.optional(),
    status: membershipStatusSchema.optional()
});

export const serviceRecordsQuerySchema = z.object({
    userId: idSchema.optional(),
    communityId: idSchema.optional(),
    isActive: z.boolean().optional()
});

