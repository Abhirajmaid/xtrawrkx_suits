'use strict';

/**
 * task controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::task.task', ({ strapi }) => ({
    /**
     * Get all tasks (for global tasks page)
     */
    async findAll(ctx) {
        try {

            const { query } = ctx;

            // Remove populate from query to avoid Strapi parsing errors - we handle populate ourselves
            delete query.populate;

            // Parse filters from query string if needed
            let filters = {};
            if (query.filters) {
                try {
                    filters = typeof query.filters === 'string'
                        ? JSON.parse(query.filters)
                        : query.filters;
                } catch (e) {
                    filters = {};
                }
            }

            // Parse sort - handle both string and object formats
            let sort = {};
            if (query.sort) {
                if (typeof query.sort === 'string') {
                    // Handle "createdAt:desc" format
                    const [field, order] = query.sort.split(':');
                    sort = { [field]: order || 'desc' };
                } else {
                    sort = query.sort;
                }
            } else {
                sort = { createdAt: 'desc' };
            }

            // Parse pagination
            let pagination = { page: 1, pageSize: 100 };
            if (query.pagination) {
                pagination = typeof query.pagination === 'string'
                    ? JSON.parse(query.pagination)
                    : query.pagination;
            } else {
                if (query['pagination[page]']) {
                    // @ts-ignore
                    pagination.page = parseInt(query['pagination[page]']) || 1;
                }
                if (query['pagination[pageSize]']) {
                    // @ts-ignore
                    pagination.pageSize = parseInt(query['pagination[pageSize]']) || 100;
                }
            }

            // First, let's check if there are any tasks at all without filters
            const allTasksCount = await strapi.db.query('api::task.task').count();

            // Always use our own populate configuration - ignore any populate from query
            const tasks = await strapi.entityService.findPage('api::task.task', {
                filters,
                populate: {
                    createdBy: true,
                    assignee: true,
                    projects: true,
                    collaborators: true,
                    leadCompany: true,
                    clientAccount: true,
                    contact: true,
                    deal: true
                },
                sort,
                pagination
            });

            // Also try using db.query directly as a fallback
            // @ts-ignore
            if ((!tasks?.data || tasks.data.length === 0) && allTasksCount > 0) {
                const dbTasks = await strapi.db.query('api::task.task').findMany({
                    orderBy: sort,
                    limit: pagination.pageSize,
                    offset: (pagination.page - 1) * pagination.pageSize,
                });

                if (dbTasks.length > 0) {
                    // Populate manually
                    const populatedTasks = await Promise.all(
                        dbTasks.map(async (task) => {
                            const populated = await strapi.entityService.findOne('api::task.task', task.id, {
                                populate: {
                                    createdBy: true,
                                    assignee: true,
                                    projects: true,
                                    collaborators: true,
                                    leadCompany: true,
                                    clientAccount: true,
                                    contact: true,
                                    deal: true
                                }
                            });
                            return populated;
                        })
                    );

                    return ctx.send({
                        data: populatedTasks,
                        meta: {
                            pagination: {
                                page: pagination.page || 1,
                                pageSize: pagination.pageSize || 100,
                                pageCount: Math.ceil(allTasksCount / pagination.pageSize),
                                total: allTasksCount
                            }
                        }
                    });
                }
            }

            // Ensure we return a proper format even if empty
            // @ts-ignore
            if (!tasks || !tasks.data) {
                return ctx.send({
                    data: [],
                    meta: {
                        pagination: {
                            page: pagination.page || 1,
                            pageSize: pagination.pageSize || 100,
                            pageCount: 0,
                            total: 0
                        }
                    }
                });
            }

            return ctx.send(tasks);
        } catch (error) {
            console.error('Error fetching all tasks:', error);
            return ctx.badRequest(`Failed to fetch tasks: ${error.message}`);
        }
    },

    /**
     * Get tasks by entity
     */
    async findByEntity(ctx) {
        try {
            const { entityType, entityId } = ctx.params;

            if (!entityType || !entityId) {
                return ctx.badRequest('Entity type and ID are required');
            }

            const entityFieldMap = {
                leadCompany: 'leadCompany',
                clientAccount: 'clientAccount',
                contact: 'contact',
                deal: 'deal'
            };

            const entityField = entityFieldMap[entityType];
            if (!entityField) {
                return ctx.badRequest('Invalid entity type');
            }

            const tasks = await strapi.entityService.findMany('api::task.task', {
                filters: {
                    [entityField]: {
                        id: { $eq: entityId }
                    }
                },
                populate: {
                    createdBy: true,
                    assignee: true,
                    collaborators: true
                },
                sort: {
                    createdAt: 'desc'
                }
            });

            return { data: tasks };
        } catch (error) {
            console.error('Error fetching tasks:', error);
            return ctx.badRequest(`Failed to fetch tasks: ${error.message}`);
        }
    },

    /**
     * Get a single task by ID
     */
    async findOne(ctx) {
        try {
            const { id } = ctx.params;
            const { query } = ctx;

            // Parse populate from query string - SIMPLIFIED VERSION
            let populate = {};
            if (query.populate) {
                const populateFields = typeof query.populate === 'string'
                    ? query.populate.split(',')
                    : Array.isArray(query.populate)
                        ? query.populate
                        : [];

                // Field name mapping for backward compatibility
                const fieldMapping = {
                    'project': 'projects' // Map singular "project" to plural "projects"
                };

                // Simple approach: only handle top-level fields for now
                // Nested populate will be handled separately if needed
                populateFields.forEach(field => {
                    const trimmedField = field.trim();
                    // Skip nested fields (containing '.') for now
                    if (trimmedField && !trimmedField.includes('.')) {
                        // Map field name if needed
                        const mappedField = fieldMapping[trimmedField] || trimmedField;
                        populate[mappedField] = true;
                    }
                });

            } else {
                // Default populate
                populate = {
                    createdBy: true,
                    assignee: true,
                    projects: true,
                    subtasks: {
                        assignee: true,
                        childSubtasks: true
                    },
                    leadCompany: true,
                    clientAccount: true,
                    contact: true,
                    deal: true,
                    collaborators: true
                };
            }

            const task = await strapi.entityService.findOne('api::task.task', id, {
                populate
            });

            if (!task) {
                return ctx.notFound('Task not found');
            }

            return { data: task };
        } catch (error) {
            console.error('Error fetching task:', error);
            return ctx.badRequest(`Failed to fetch task: ${error.message}`);
        }
    },

    /**
     * Create a new task
     */
    async create(ctx) {
        try {
            const { data } = ctx.request.body;

            if (!data || !data.title) {
                return ctx.badRequest('Title is required');
            }

            let userId = data.createdBy || ctx.state?.user?.id;
            if (!userId) {
                return ctx.badRequest('User ID is required to create a task');
            }

            // Verify user exists
            let userRecord = null;
            try {
                userRecord = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').findOne({
                    where: { documentId: userId, isActive: true },
                });

                if (!userRecord) {
                    userRecord = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').findOne({
                        where: { id: userId, isActive: true },
                    });
                }

                if (!userRecord) {
                    return ctx.badRequest('User not found or inactive');
                }
            } catch (userError) {
                console.error('Error finding user:', userError);
                return ctx.badRequest('Failed to verify user');
            }

            // Prepare task data with numeric IDs for relations
            const userRelationIdNum = userRecord.id || parseInt(userRecord.documentId) || parseInt(userId);

            // Handle assignee if provided
            let assigneeId = null;
            if (data.assignee) {
                try {
                    const assigneeRecord = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').findOne({
                        where: { id: parseInt(data.assignee) },
                    });
                    if (assigneeRecord) {
                        assigneeId = assigneeRecord.id;
                    }
                } catch (assigneeError) {
                    console.error('Error finding assignee:', assigneeError);
                    // Continue without assignee if not found
                }
            }

            // Determine if this is a CRM task or PM task
            let entityField = null;
            let entityRelationIdNum = null;

            // Check if it's a CRM task (has entityType and entityId)
            if (data.entityType && data.entityId) {
                // Map entity types to correct field names
                const entityFieldMap = {
                    leadCompany: 'leadCompany',
                    clientAccount: 'clientAccount',
                    contact: 'contact',
                    deal: 'deal'
                };

                entityField = entityFieldMap[data.entityType];
                if (!entityField) {
                    return ctx.badRequest('Invalid entity type');
                }

                // Verify entity exists and get numeric ID
                const entityModelMap = {
                    leadCompany: 'api::lead-company.lead-company',
                    clientAccount: 'api::client-account.client-account',
                    contact: 'api::contact.contact',
                    deal: 'api::deal.deal'
                };

                const entityModel = entityModelMap[data.entityType];
                const entityIdNum = parseInt(data.entityId);

                try {
                    const entity = await strapi.db.query(entityModel).findOne({
                        where: { id: entityIdNum },
                    });

                    if (!entity) {
                        return ctx.badRequest(`Entity ${entityField} with ID ${entityIdNum} not found`);
                    }
                    entityRelationIdNum = entityIdNum;
                } catch (entityError) {
                    console.error('Error verifying entity:', entityError);
                    return ctx.badRequest('Failed to verify entity');
                }
            }

            // Handle projects if provided (PM task)
            let projectIds = [];
            if (data.projects !== undefined && Array.isArray(data.projects) && data.projects.length > 0) {
                try {
                    const projectIdNums = data.projects
                        .map(p => typeof p === 'object' ? p.id : p)
                        .map(id => parseInt(id))
                        .filter(id => !isNaN(id));

                    // Verify all projects exist
                    for (const projectId of projectIdNums) {
                        const projectRecord = await strapi.db.query('api::project.project').findOne({
                            where: { id: projectId },
                        });
                        if (projectRecord) {
                            projectIds.push(projectRecord.id);
                        }
                    }
                } catch (projectError) {
                    console.error('Error finding projects:', projectError);
                    return ctx.badRequest('One or more projects not found');
                }
            }

            // Build task data
            const taskData = {
                title: data.title,
                description: data.description || null,
                status: data.status || 'SCHEDULED',
                priority: data.priority || 'MEDIUM',
                scheduledDate: data.scheduledDate || null,
                progress: data.progress || 0,
                tags: data.tags || null,
                createdBy: userRelationIdNum,
            };

            // Add relations
            if (assigneeId) {
                taskData.assignee = assigneeId;
            }

            if (entityField && entityRelationIdNum) {
                taskData[entityField] = entityRelationIdNum;
            }

            if (projectIds.length > 0) {
                taskData.projects = projectIds;
            }

            // Handle collaborators if provided
            if (data.collaborators !== undefined) {
                if (Array.isArray(data.collaborators) && data.collaborators.length > 0) {
                    try {
                        // Convert collaborator IDs to integers and validate they exist
                        const collaboratorIds = data.collaborators
                            .map(collabId => {
                                const id = typeof collabId === 'object' ? collabId.id : collabId;
                                return parseInt(id, 10);
                            })
                            .filter(id => !isNaN(id));

                        // Verify all collaborator IDs exist
                        const validCollaborators = [];
                        for (const collabId of collaboratorIds) {
                            const userRecord = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').findOne({
                                where: { id: collabId },
                            });
                            if (userRecord) {
                                validCollaborators.push(userRecord.id);
                            }
                        }
                        if (validCollaborators.length > 0) {
                            taskData.collaborators = validCollaborators;
                        }
                    } catch (collabError) {
                        console.error('Error finding collaborators:', collabError);
                        // Don't fail task creation if collaborators can't be added
                    }
                }
            }

            // Create task
            const task = await strapi.entityService.create('api::task.task', {
                data: taskData
            });

            // Fetch with populated relations
            const populatedTask = await strapi.entityService.findOne('api::task.task', task.id, {
                populate: {
                    createdBy: true,
                    assignee: true,
                    projects: true,
                    collaborators: true,
                    leadCompany: true,
                    clientAccount: true,
                    contact: true,
                    deal: true
                }
            });

            return { data: populatedTask };
        } catch (error) {
            console.error('Error creating task:', error);

            if (error.message?.includes('relation') || error.message?.includes('admin::user')) {
                return ctx.badRequest(
                    `Failed to create task. Please ensure Strapi has been restarted after schema changes. Error: ${error.message}`
                );
            }

            return ctx.badRequest(`Failed to create task: ${error.message}`);
        }
    },

    /**
     * Update a task
     */
    async update(ctx) {
        try {
            const { id } = ctx.params;
            const { data } = ctx.request.body;


            // Get the existing task
            const existingTask = await strapi.entityService.findOne('api::task.task', id, {
                populate: ['createdBy', 'assignee']
            });

            if (!existingTask) {
                console.error(`Task ${id} not found`);
                return ctx.notFound('Task not found');
            }


            // Handle status change to COMPLETED
            const updateData = { ...data };

            // Remove any 'project' key (old schema) - we handle 'projects' separately below
            if (updateData.project !== undefined) {
                delete updateData.project;
            }

            // Map frontend status values to backend enum values
            // Handle both frontend format and already-transformed Strapi format
            if (data.status !== undefined && data.status !== null) {
                // Normalize the status to handle case variations
                const normalizedStatus = String(data.status).trim();

                const statusMap = {
                    // Frontend formats (case-insensitive matching)
                    'to do': 'SCHEDULED',
                    'todo': 'SCHEDULED',
                    'in progress': 'IN_PROGRESS',
                    'in review': 'IN_REVIEW',
                    'done': 'COMPLETED',
                    'completed': 'COMPLETED',
                    'cancelled': 'CANCELLED',
                    'canceled': 'CANCELLED', // Handle US spelling
                    // Exact matches (case-sensitive for already-transformed values)
                    'To Do': 'SCHEDULED',
                    'In Progress': 'IN_PROGRESS',
                    'In Review': 'IN_REVIEW',
                    'Done': 'COMPLETED',
                    'Cancelled': 'CANCELLED',
                    // Already in Strapi format - pass through
                    'SCHEDULED': 'SCHEDULED',
                    'IN_PROGRESS': 'IN_PROGRESS',
                    'IN_REVIEW': 'IN_REVIEW',
                    'COMPLETED': 'COMPLETED',
                    'CANCELLED': 'CANCELLED'
                };

                // Try exact match first, then case-insensitive
                let mappedStatus = statusMap[normalizedStatus] || statusMap[normalizedStatus.toLowerCase()];

                if (mappedStatus) {
                    updateData.status = mappedStatus;
                } else {
                    // If not in map, try to normalize to uppercase with underscores
                    const normalized = normalizedStatus.toUpperCase().replace(/\s+/g, '_');
                    // Validate against schema enum values
                    const validStatuses = ['SCHEDULED', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'CANCELLED'];
                    if (validStatuses.includes(normalized)) {
                        updateData.status = normalized;
                    } else {
                        updateData.status = data.status;
                    }
                }
            }

            // Map frontend priority values to backend enum values
            if (data.priority !== undefined && data.priority !== null) {
                const priorityMap = {
                    'Low': 'LOW',
                    'low': 'LOW',
                    'LOW': 'LOW',
                    'Medium': 'MEDIUM',
                    'medium': 'MEDIUM',
                    'MEDIUM': 'MEDIUM',
                    'High': 'HIGH',
                    'high': 'HIGH',
                    'HIGH': 'HIGH'
                };
                updateData.priority = priorityMap[data.priority] || data.priority;
            }

            if (updateData.status === 'COMPLETED' && existingTask.status !== 'COMPLETED') {
                updateData.completedDate = new Date().toISOString();
            } else if (updateData.status !== 'COMPLETED' && existingTask.status === 'COMPLETED') {
                updateData.completedDate = null;
            }

            // Handle assignee if provided
            if (data.assignee !== undefined) {
                if (data.assignee) {
                    try {
                        const assigneeRecord = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').findOne({
                            where: { id: parseInt(data.assignee) },
                        });
                        if (assigneeRecord) {
                            updateData.assignee = assigneeRecord.id;
                        } else {
                            delete updateData.assignee;
                        }
                    } catch (assigneeError) {
                        console.error('Error finding assignee:', assigneeError);
                        delete updateData.assignee;
                    }
                } else {
                    updateData.assignee = null;
                }
            }

            // Handle projects if provided
            if (data.projects !== undefined) {
                if (Array.isArray(data.projects) && data.projects.length > 0) {
                    try {
                        const projectIdNums = data.projects
                            .map(p => typeof p === 'object' ? p.id : p)
                            .map(id => parseInt(id))
                            .filter(id => !isNaN(id));

                        // Verify all projects exist
                        const validProjectIds = [];
                        for (const projectId of projectIdNums) {
                            const projectRecord = await strapi.db.query('api::project.project').findOne({
                                where: { id: projectId },
                            });
                            if (projectRecord) {
                                validProjectIds.push(projectRecord.id);
                            }
                        }
                        updateData.projects = validProjectIds;
                    } catch (projectError) {
                        console.error('Error finding projects:', projectError);
                        delete updateData.projects;
                    }
                } else {
                    // Empty array means remove all projects
                    updateData.projects = [];
                }
            }

            // Handle collaborators if provided
            if (data.collaborators !== undefined) {
                if (Array.isArray(data.collaborators) && data.collaborators.length > 0) {
                    try {
                        // Convert collaborator IDs to integers and validate they exist
                        const collaboratorIds = data.collaborators
                            .map(collabId => {
                                const id = typeof collabId === 'object' ? collabId.id : collabId;
                                return parseInt(id, 10);
                            })
                            .filter(id => !isNaN(id));

                        // Verify all collaborator IDs exist
                        const validCollaborators = [];
                        for (const collabId of collaboratorIds) {
                            const userRecord = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').findOne({
                                where: { id: collabId },
                            });
                            if (userRecord) {
                                validCollaborators.push(userRecord.id);
                            }
                        }
                        updateData.collaborators = validCollaborators;
                    } catch (collabError) {
                        console.error('Error finding collaborators:', collabError);
                        // Don't update collaborators if there's an error
                        delete updateData.collaborators;
                    }
                } else {
                    // Empty array means remove all collaborators
                    updateData.collaborators = [];
                }
            }

            // Remove any remaining 'project' key (old schema) before sending to entityService
            if (updateData.project !== undefined) {
                delete updateData.project;
            }

            const updatedTask = await strapi.entityService.update('api::task.task', id, {
                data: updateData,
                populate: {
                    createdBy: true,
                    assignee: true,
                    projects: true,
                    collaborators: true
                }
            });


            return { data: updatedTask };
        } catch (error) {
            console.error('Error updating task:', error);
            return ctx.badRequest(`Failed to update task: ${error.message}`);
        }
    },

    /**
     * Update task status
     */
    async updateStatus(ctx) {
        try {
            const { id } = ctx.params;
            const { status } = ctx.request.body;

            if (!status) {
                return ctx.badRequest('Status is required');
            }

            const existingTask = await strapi.entityService.findOne('api::task.task', id);

            if (!existingTask) {
                return ctx.notFound('Task not found');
            }

            const updateData = { status };

            if (status === 'COMPLETED' && existingTask.status !== 'COMPLETED') {
                updateData.completedDate = new Date().toISOString();
            } else if (status !== 'COMPLETED' && existingTask.status === 'COMPLETED') {
                updateData.completedDate = null;
            }

            const updatedTask = await strapi.entityService.update('api::task.task', id, {
                data: updateData,
                populate: {
                    createdBy: true,
                    assignee: true
                }
            });

            return { data: updatedTask };
        } catch (error) {
            console.error('Error updating task status:', error);
            return ctx.badRequest(`Failed to update task status: ${error.message}`);
        }
    },

    /**
     * Delete a task
     */
    async delete(ctx) {
        try {
            const { id } = ctx.params;

            if (!id) {
                return ctx.badRequest('Task ID is required');
            }

            console.log('Deleting task with ID:', id);

            // Check if task exists
            const existingTask = await strapi.entityService.findOne('api::task.task', id);

            if (!existingTask) {
                console.log('Task not found:', id);
                return ctx.notFound('Task not found');
            }

            // Delete the task
            const deletedTask = await strapi.entityService.delete('api::task.task', id);

            console.log('Task deleted successfully:', id);

            return ctx.send({ data: deletedTask });
        } catch (error) {
            console.error('Error deleting task:', error);
            return ctx.badRequest(`Failed to delete task: ${error.message}`);
        }
    },
}));

