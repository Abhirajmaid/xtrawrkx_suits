'use strict';

/**
 * subtask controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::subtask.subtask', ({ strapi }) => ({
    /**
     * Create a new subtask
     */
    async create(ctx) {
        try {
            const { data } = ctx.request.body;

            if (!data) {
                return ctx.badRequest('Data is required');
            }

            // Validate required fields
            if (!data.title) {
                return ctx.badRequest('Title is required');
            }

            if (!data.task) {
                return ctx.badRequest('Task is required');
            }

            // Ensure task ID is an integer
            const taskId = typeof data.task === 'string' ? parseInt(data.task, 10) : data.task;

            if (!taskId || isNaN(taskId)) {
                return ctx.badRequest('Invalid task ID');
            }

            // Verify task exists
            const task = await strapi.entityService.findOne('api::task.task', taskId);
            if (!task) {
                return ctx.badRequest('Task not found');
            }

            // Build subtask data
            const subtaskData = {
                title: data.title,
                description: data.description || null,
                status: data.status || 'SCHEDULED',
                priority: data.priority || 'MEDIUM',
                progress: data.progress || 0,
                depth: data.depth || 0,
                order: data.order || 0,
                dueDate: data.dueDate || null,
                task: taskId,
            };

            // Add parent subtask if provided
            if (data.parentSubtask) {
                const parentId = typeof data.parentSubtask === 'string'
                    ? parseInt(data.parentSubtask, 10)
                    : data.parentSubtask;
                const parent = await strapi.entityService.findOne('api::subtask.subtask', parentId);
                if (parent) {
                    subtaskData.parentSubtask = parentId;
                }
            }

            // Add assignee if provided
            if (data.assignee) {
                const assigneeId = typeof data.assignee === 'string'
                    ? parseInt(data.assignee, 10)
                    : data.assignee;
                const assignee = await strapi.entityService.findOne('api::xtrawrkx-user.xtrawrkx-user', assigneeId);
                if (assignee) {
                    subtaskData.assignee = assigneeId;
                }
            }

            // Create subtask
            const subtask = await strapi.entityService.create('api::subtask.subtask', {
                data: subtaskData
            });

            // Fetch with populated relations
            const populatedSubtask = await strapi.entityService.findOne('api::subtask.subtask', subtask.id, {
                populate: {
                    task: true,
                    assignee: true,
                    parentSubtask: true,
                    childSubtasks: true
                }
            });

            return { data: populatedSubtask };
        } catch (error) {
            console.error('Error creating subtask:', error);
            return ctx.internalServerError('Failed to create subtask');
        }
    },

    /**
     * Get a single subtask by ID
     */
    async findOne(ctx) {
        try {
            const { id } = ctx.params;
            const { query } = ctx;

            // Parse populate from query string
            let populate = {
                task: true,
                assignee: true,
                parentSubtask: true,
                childSubtasks: true
            };

            if (query.populate) {
                const populateFields = typeof query.populate === 'string'
                    ? query.populate.split(',')
                    : Array.isArray(query.populate)
                        ? query.populate
                        : [];

                // Build populate object - simplified for TypeScript
                const customPopulate = {};
                populateFields.forEach(field => {
                    const trimmedField = field.trim();
                    if (trimmedField && !trimmedField.includes('.')) {
                        customPopulate[trimmedField] = true;
                    }
                });

                // Merge with default if custom populate has fields
                if (Object.keys(customPopulate).length > 0) {
                    populate = { ...populate, ...customPopulate };
                }
            }

            const subtask = await strapi.entityService.findOne('api::subtask.subtask', id, {
                populate
            });

            if (!subtask) {
                return ctx.notFound('Subtask not found');
            }

            return { data: subtask };
        } catch (error) {
            console.error('Error fetching subtask:', error);
            return ctx.badRequest(`Failed to fetch subtask: ${error.message}`);
        }
    },

    /**
     * Get all subtasks
     */
    async find(ctx) {
        try {
            const { query } = ctx;

            // Parse populate from query string
            let populate = {
                task: true,
                assignee: true,
                parentSubtask: true,
                childSubtasks: true
            };

            if (query.populate) {
                const populateFields = typeof query.populate === 'string'
                    ? query.populate.split(',')
                    : Array.isArray(query.populate)
                        ? query.populate
                        : [];

                // Build populate object - simplified for TypeScript
                const customPopulate = {};
                populateFields.forEach(field => {
                    const trimmedField = field.trim();
                    if (trimmedField && !trimmedField.includes('.')) {
                        customPopulate[trimmedField] = true;
                    }
                });

                // Merge with default if custom populate has fields
                if (Object.keys(customPopulate).length > 0) {
                    populate = { ...populate, ...customPopulate };
                }
            }

            // Use default find with custom populate
            const { results, pagination } = await strapi.entityService.findPage('api::subtask.subtask', {
                ...query,
                populate
            });

            return { data: results, meta: { pagination } };
        } catch (error) {
            console.error('Error fetching subtasks:', error);
            return ctx.badRequest(`Failed to fetch subtasks: ${error.message}`);
        }
    },

    /**
     * Update a subtask
     */
    async update(ctx) {
        try {
            const { id } = ctx.params;
            const { data } = ctx.request.body;

            if (!data) {
                return ctx.badRequest('Data is required');
            }

            // Get existing subtask
            const existingSubtask = await strapi.entityService.findOne('api::subtask.subtask', id);
            if (!existingSubtask) {
                return ctx.notFound('Subtask not found');
            }

            const updateData = { ...data };

            // Map frontend status values to backend enum values
            if (data.status !== undefined && data.status !== null) {
                const statusMap = {
                    'To Do': 'SCHEDULED',
                    'In Progress': 'IN_PROGRESS',
                    'In Review': 'IN_REVIEW',
                    'Done': 'COMPLETED',
                    'Completed': 'COMPLETED',
                    'Cancelled': 'CANCELLED',
                    'SCHEDULED': 'SCHEDULED',
                    'IN_PROGRESS': 'IN_PROGRESS',
                    'IN_REVIEW': 'IN_REVIEW',
                    'COMPLETED': 'COMPLETED',
                    'CANCELLED': 'CANCELLED'
                };
                updateData.status = statusMap[data.status] || data.status;
            }

            // Map frontend priority values to backend enum values
            if (data.priority !== undefined && data.priority !== null) {
                const priorityMap = {
                    'Low': 'LOW',
                    'Medium': 'MEDIUM',
                    'High': 'HIGH',
                    'LOW': 'LOW',
                    'MEDIUM': 'MEDIUM',
                    'HIGH': 'HIGH'
                };
                updateData.priority = priorityMap[data.priority] || data.priority;
            }

            // Handle assignee if provided
            if (data.assignee !== undefined) {
                if (data.assignee) {
                    const assigneeId = typeof data.assignee === 'string'
                        ? parseInt(data.assignee, 10)
                        : data.assignee;
                    const assignee = await strapi.entityService.findOne('api::xtrawrkx-user.xtrawrkx-user', assigneeId);
                    if (assignee) {
                        updateData.assignee = assigneeId;
                    } else {
                        delete updateData.assignee;
                    }
                } else {
                    updateData.assignee = null;
                }
            }

            // Handle parent subtask if provided
            if (data.parentSubtask !== undefined) {
                if (data.parentSubtask) {
                    const parentId = typeof data.parentSubtask === 'string'
                        ? parseInt(data.parentSubtask, 10)
                        : data.parentSubtask;
                    const parent = await strapi.entityService.findOne('api::subtask.subtask', parentId);
                    if (parent) {
                        updateData.parentSubtask = parentId;
                        // Update depth based on parent
                        updateData.depth = (parent.depth || 0) + 1;
                    } else {
                        delete updateData.parentSubtask;
                    }
                } else {
                    updateData.parentSubtask = null;
                    updateData.depth = 0;
                }
            }

            // Update subtask
            const updatedSubtask = await strapi.entityService.update('api::subtask.subtask', id, {
                data: updateData,
                populate: {
                    task: true,
                    assignee: true,
                    parentSubtask: true,
                    childSubtasks: true
                }
            });

            return { data: updatedSubtask };
        } catch (error) {
            console.error('Error updating subtask:', error);
            return ctx.badRequest(`Failed to update subtask: ${error.message}`);
        }
    },

    /**
     * Delete a subtask
     */
    async delete(ctx) {
        try {
            const { id } = ctx.params;

            // Get subtask with children
            const subtask = await strapi.entityService.findOne('api::subtask.subtask', id, {
                populate: {
                    childSubtasks: true
                }
            });

            if (!subtask) {
                return ctx.notFound('Subtask not found');
            }

            // Delete all child subtasks recursively
            // First get all child subtasks
            const childSubtasks = await strapi.entityService.findMany('api::subtask.subtask', {
                filters: {
                    parentSubtask: {
                        id: { $eq: id }
                    }
                }
            });

            // Delete all children first
            for (const child of childSubtasks) {
                await strapi.entityService.delete('api::subtask.subtask', child.id);
            }

            // Delete the subtask itself
            const deletedSubtask = await strapi.entityService.delete('api::subtask.subtask', id);

            return { data: deletedSubtask };
        } catch (error) {
            console.error('Error deleting subtask:', error);
            return ctx.badRequest(`Failed to delete subtask: ${error.message}`);
        }
    },
}));


