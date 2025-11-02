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
            console.log('=== findAll method called ===');
            console.log('Request URL:', ctx.request.url);
            console.log('Request method:', ctx.request.method);
            console.log('Query object:', ctx.query);

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
                    pagination.page = parseInt(query['pagination[page]']) || 1;
                }
                if (query['pagination[pageSize]']) {
                    pagination.pageSize = parseInt(query['pagination[pageSize]']) || 100;
                }
            }

            console.log('Query parameters:', { filters, sort, pagination });

            // First, let's check if there are any tasks at all without filters
            const allTasksCount = await strapi.db.query('api::task.task').count();
            console.log('Total tasks in database (using db.query):', allTasksCount);

            // Always use our own populate configuration - ignore any populate from query
            const tasks = await strapi.entityService.findPage('api::task.task', {
                filters,
                populate: {
                    createdBy: true,
                    assignee: true,
                    leadCompany: true,
                    clientAccount: true,
                    contact: true,
                    deal: true
                },
                sort,
                pagination
            });

            console.log('Tasks fetched from database (entityService.findPage):', tasks);
            console.log('Number of tasks:', tasks?.data?.length || 0);
            console.log('Tasks response structure:', {
                hasData: !!tasks?.data,
                dataIsArray: Array.isArray(tasks?.data),
                dataLength: tasks?.data?.length || 0,
                hasMeta: !!tasks?.meta,
                metaPagination: tasks?.meta?.pagination
            });

            // Also try using db.query directly as a fallback
            if ((!tasks?.data || tasks.data.length === 0) && allTasksCount > 0) {
                console.log('Warning: entityService returned empty but db.query shows tasks exist. Trying db.query...');
                const dbTasks = await strapi.db.query('api::task.task').findMany({
                    orderBy: sort,
                    limit: pagination.pageSize,
                    offset: (pagination.page - 1) * pagination.pageSize,
                });
                console.log('Tasks from db.query:', dbTasks.length);

                if (dbTasks.length > 0) {
                    // Populate manually
                    const populatedTasks = await Promise.all(
                        dbTasks.map(async (task) => {
                            const populated = await strapi.entityService.findOne('api::task.task', task.id, {
                                populate: {
                                    createdBy: true,
                                    assignee: true,
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
                    assignee: true
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
     * Create a new task
     */
    async create(ctx) {
        try {
            const { data } = ctx.request.body;

            if (!data || !data.title) {
                return ctx.badRequest('Title is required');
            }

            // Map entity types to correct field names
            const entityFieldMap = {
                leadCompany: 'leadCompany',
                clientAccount: 'clientAccount',
                contact: 'contact',
                deal: 'deal'
            };

            const entityField = entityFieldMap[data.entityType];
            if (!entityField) {
                return ctx.badRequest('Invalid entity type');
            }

            if (!data.entityId) {
                return ctx.badRequest('Entity ID is required');
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
            } catch (entityError) {
                console.error('Error verifying entity:', entityError);
                return ctx.badRequest('Failed to verify entity');
            }

            // Prepare task data with numeric IDs for relations
            const userRelationIdNum = userRecord.id || parseInt(userRecord.documentId) || parseInt(userId);
            const entityRelationIdNum = entityIdNum;

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

            const taskData = {
                title: data.title,
                description: data.description || null,
                status: data.status || 'SCHEDULED',
                priority: data.priority || 'MEDIUM',
                scheduledDate: data.scheduledDate || null,
                createdBy: userRelationIdNum,
                [entityField]: entityRelationIdNum,
            };

            if (assigneeId) {
                taskData.assignee = assigneeId;
            }

            // Create task
            const task = await strapi.entityService.create('api::task.task', {
                data: taskData
            });

            // Fetch with populated relations
            const populatedTask = await strapi.entityService.findOne('api::task.task', task.id, {
                populate: {
                    createdBy: true,
                    assignee: true
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
                return ctx.notFound('Task not found');
            }

            // Handle status change to COMPLETED
            const updateData = { ...data };
            if (data.status === 'COMPLETED' && existingTask.status !== 'COMPLETED') {
                updateData.completedDate = new Date().toISOString();
            } else if (data.status !== 'COMPLETED' && existingTask.status === 'COMPLETED') {
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

            const updatedTask = await strapi.entityService.update('api::task.task', id, {
                data: updateData,
                populate: {
                    createdBy: true,
                    assignee: true
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

