'use strict';

/**
 * Department controller
 */
module.exports = {
    /**
     * Get all active departments
     */
    async find(ctx) {
        try {
            const departments = await strapi.entityService.findMany('api::department.department', {
                filters: {
                    isActive: true
                },
                sort: ['sortOrder:asc', 'name:asc'],
                populate: {
                    users: {
                        fields: ['id', 'firstName', 'lastName', 'email']
                    }
                }
            });

            return ctx.send({
                data: departments,
                meta: {
                    pagination: {
                        page: 1,
                        pageSize: 10,
                        pageCount: 1,
                        total: departments.length
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching departments:', error);
            return ctx.internalServerError('Failed to fetch departments');
        }
    },

    /**
     * Get department by ID
     */
    async findOne(ctx) {
        try {
            const { id } = ctx.params;

            const department = await strapi.entityService.findOne('api::department.department', id, {
                populate: {
                    users: {
                        fields: ['id', 'firstName', 'lastName', 'email']
                    }
                }
            });

            if (!department) {
                return ctx.notFound('Department not found');
            }

            return ctx.send({
                data: department
            });
        } catch (error) {
            console.error('Error fetching department:', error);
            return ctx.internalServerError('Failed to fetch department');
        }
    },

    /**
     * Create new department
     */
    async create(ctx) {
        try {
            const { data } = ctx.request.body;

            // Validate required fields
            if (!data.name || !data.code) {
                return ctx.badRequest('Name and code are required');
            }

            // Check if code already exists
            const existingDepartment = await strapi.entityService.findMany('api::department.department', {
                filters: {
                    code: data.code
                }
            });

            if (existingDepartment.length > 0) {
                return ctx.badRequest('Department code already exists');
            }

            const department = await strapi.entityService.create('api::department.department', {
                data: {
                    name: data.name,
                    code: data.code,
                    description: data.description || '',
                    isActive: data.isActive !== undefined ? data.isActive : true,
                    sortOrder: data.sortOrder || 0,
                    color: data.color || '#3B82F6'
                }
            });

            return ctx.send({
                data: department
            }, 201);
        } catch (error) {
            console.error('Error creating department:', error);
            return ctx.internalServerError('Failed to create department');
        }
    },

    /**
     * Update department
     */
    async update(ctx) {
        try {
            const { id } = ctx.params;
            const { data } = ctx.request.body;

            // Check if department exists
            const existingDepartment = await strapi.entityService.findOne('api::department.department', id);
            if (!existingDepartment) {
                return ctx.notFound('Department not found');
            }

            // Check if code is being changed and if it already exists
            if (data.code && data.code !== existingDepartment.code) {
                const codeExists = await strapi.entityService.findMany('api::department.department', {
                    filters: {
                        code: data.code,
                        id: {
                            $ne: id
                        }
                    }
                });

                if (codeExists.length > 0) {
                    return ctx.badRequest('Department code already exists');
                }
            }

            const department = await strapi.entityService.update('api::department.department', id, {
                data: {
                    ...data,
                    updatedAt: new Date()
                }
            });

            return ctx.send({
                data: department
            });
        } catch (error) {
            console.error('Error updating department:', error);
            return ctx.internalServerError('Failed to update department');
        }
    },

    /**
     * Delete department
     */
    async delete(ctx) {
        try {
            const { id } = ctx.params;

            // Check if department exists
            const existingDepartment = await strapi.entityService.findOne('api::department.department', id, {
                populate: {
                    users: true
                }
            });

            if (!existingDepartment) {
                return ctx.notFound('Department not found');
            }

            // Check if department has users
            if (existingDepartment.users && existingDepartment.users.length > 0) {
                return ctx.badRequest('Cannot delete department with assigned users');
            }

            await strapi.entityService.delete('api::department.department', id);

            return ctx.send({
                message: 'Department deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting department:', error);
            return ctx.internalServerError('Failed to delete department');
        }
    },

    /**
     * Get department statistics
     */
    async getStats(ctx) {
        try {
            const departments = await strapi.entityService.findMany('api::department.department', {
                populate: {
                    users: true
                }
            });

            const stats = departments.map(dept => ({
                id: dept.id,
                name: dept.name,
                code: dept.code,
                userCount: dept.users ? dept.users.length : 0,
                isActive: dept.isActive
            }));

            return ctx.send({
                data: stats
            });
        } catch (error) {
            console.error('Error fetching department stats:', error);
            return ctx.internalServerError('Failed to fetch department statistics');
        }
    }
};
