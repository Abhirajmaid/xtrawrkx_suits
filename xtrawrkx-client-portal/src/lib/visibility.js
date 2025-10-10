/**
 * Visibility and permission utilities
 */

import { Role, TaskSource } from './types.js';

/**
 * Check if user can view task
 * @param {import('./types.js').TaskDTO} task 
 * @param {import('./types.js').SessionUser} user 
 * @returns {boolean}
 */
export function canViewTask(task, user) {
    // Admins can see everything
    if (user.role === Role.ADMIN) {
        return true;
    }

    // Internal users can see all tasks
    if (user.role === Role.INTERNAL) {
        return true;
    }

    // Client users can only see tasks they created
    if (user.role === Role.CLIENT) {
        return task.createdById === user.id;
    }

    return false;
}

/**
 * Check if user can edit task
 * @param {import('./types.js').TaskDTO} task 
 * @param {import('./types.js').SessionUser} user 
 * @returns {boolean}
 */
export function canEditTask(task, user) {
    // Admins can edit everything
    if (user.role === Role.ADMIN) {
        return true;
    }

    // Internal users can edit all tasks
    if (user.role === Role.INTERNAL) {
        return true;
    }

    // Client users can only edit tasks they created
    if (user.role === Role.CLIENT) {
        return task.createdById === user.id;
    }

    return false;
}

/**
 * Check if user can delete task
 * @param {import('./types.js').TaskDTO} task 
 * @param {import('./types.js').SessionUser} user 
 * @returns {boolean}
 */
export function canDeleteTask(task, user) {
    // Same rules as editing for now
    return canEditTask(task, user);
}

/**
 * Check if user can view project
 * @param {import('./types.js').ProjectDTO} project 
 * @param {import('./types.js').SessionUser} user 
 * @returns {boolean}
 */
export function canViewProject(project, user) {
    // Admins can see everything
    if (user.role === Role.ADMIN) {
        return true;
    }

    // Internal users can see all projects
    if (user.role === Role.INTERNAL) {
        return true;
    }

    // Client users can see projects in communities they're members of
    if (user.role === Role.CLIENT) {
        return user.memberships?.some(m => m.communityId === project.communityId) || false;
    }

    return false;
}

/**
 * Check if user can create tasks in project
 * @param {import('./types.js').ProjectDTO} project 
 * @param {import('./types.js').SessionUser} user 
 * @returns {boolean}
 */
export function canCreateTaskInProject(project, user) {
    // Must be able to view the project first
    if (!canViewProject(project, user)) {
        return false;
    }

    // All authenticated users can create tasks in projects they can view
    return true;
}

/**
 * Filter tasks based on user permissions and scope
 * @param {import('./types.js').TaskDTO[]} tasks 
 * @param {import('./types.js').SessionUser} user 
 * @param {string} scope - 'client', 'internal', or 'all'
 * @returns {import('./types.js').TaskDTO[]}
 */
export function filterTasksByScope(tasks, user, scope = 'client') {
    // First filter by visibility permissions
    const visibleTasks = tasks.filter(task => canViewTask(task, user));

    // Then apply scope filter
    if (scope === 'client') {
        return visibleTasks.filter(task => task.source === TaskSource.CLIENT_PORTAL);
    } else if (scope === 'internal') {
        return visibleTasks.filter(task => task.source === TaskSource.INTERNAL_PM);
    }

    // 'all' scope returns all visible tasks
    return visibleTasks;
}

/**
 * Get task provenance badge info
 * @param {import('./types.js').TaskDTO} task 
 * @returns {{label: string, color: string}}
 */
export function getTaskProvenance(task) {
    switch (task.source) {
        case TaskSource.CLIENT_PORTAL:
            return { label: 'Client', color: 'blue' };
        case TaskSource.INTERNAL_PM:
            return { label: 'Internal', color: 'purple' };
        case TaskSource.IMPORT:
            return { label: 'Import', color: 'gray' };
        case TaskSource.API:
            return { label: 'API', color: 'green' };
        default:
            return { label: 'Unknown', color: 'gray' };
    }
}

/**
 * Check if user can upgrade membership
 * @param {import('./types.js').CommunityMembershipDTO} membership 
 * @param {import('./types.js').SessionUser} user 
 * @returns {boolean}
 */
export function canUpgradeMembership(membership, user) {
    // User must own the membership
    if (membership.userId !== user.id) {
        return false;
    }

    // Must be an active membership
    if (membership.status !== 'ACTIVE') {
        return false;
    }

    // Must have upgrade available
    return membership.canUpgrade || false;
}

/**
 * Get available scopes for user
 * @param {import('./types.js').SessionUser} user 
 * @returns {Array<{value: string, label: string}>}
 */
export function getAvailableScopes(user) {
    const scopes = [
        { value: 'client', label: 'Client Tasks' }
    ];

    if (user.role === Role.INTERNAL || user.role === Role.ADMIN) {
        scopes.push(
            { value: 'internal', label: 'Internal Tasks' },
            { value: 'all', label: 'All Tasks' }
        );
    }

    return scopes;
}

/**
 * Check if user can access community features
 * @param {string} communityId 
 * @param {import('./types.js').SessionUser} user 
 * @returns {boolean}
 */
export function canAccessCommunity(communityId, user) {
    // Admins can access all communities
    if (user.role === Role.ADMIN) {
        return true;
    }

    // Users must be members of the community
    return user.memberships?.some(m => m.communityId === communityId) || false;
}


