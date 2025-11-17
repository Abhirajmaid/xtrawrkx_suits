'use strict';

/**
 * xtrawrkx-user controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::xtrawrkx-user.xtrawrkx-user', ({ strapi }) => ({
    /**
     * Get all users with populated roles
     */
    async find(ctx) {
        try {
            const { query } = ctx;

            // Get users with populated roles and departments
            const users = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').findMany({
                ...query,
                populate: {
                    primaryRole: true,
                    userRoles: true,
                    department: true
                }
            });

            // Transform data to include role and department information
            const transformedUsers = users.map(user => ({
                id: user.id,
                attributes: {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    department: user.department ? {
                        data: {
                            id: user.department.id,
                            attributes: user.department
                        }
                    } : null,
                    isActive: user.isActive,
                    emailVerified: user.emailVerified,
                    lastLoginAt: user.lastLoginAt,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    primaryRole: user.primaryRole ? {
                        data: {
                            id: user.primaryRole.id,
                            attributes: user.primaryRole
                        }
                    } : null,
                    userRoles: user.userRoles ? {
                        data: user.userRoles.map(role => ({
                            id: role.id,
                            attributes: role
                        }))
                    } : { data: [] }
                }
            }));

            ctx.send({
                data: transformedUsers,
                meta: {
                    pagination: {
                        total: transformedUsers.length
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            ctx.internalServerError('Failed to fetch users');
        }
    },

    /**
     * Get a specific user with populated roles
     */
    async findOne(ctx) {
        try {
            const { id } = ctx.params;

            const user = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').findOne({
                where: { id },
                populate: {
                    primaryRole: true,
                    userRoles: true,
                    department: true
                }
            });

            if (!user) {
                return ctx.notFound('User not found');
            }

            ctx.send({
                data: {
                    id: user.id,
                    attributes: {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phone: user.phone,
                        department: user.department ? {
                            data: {
                                id: user.department.id,
                                attributes: user.department
                            }
                        } : null,
                        isActive: user.isActive,
                        emailVerified: user.emailVerified,
                        lastLoginAt: user.lastLoginAt,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                        primaryRole: user.primaryRole ? {
                            data: {
                                id: user.primaryRole.id,
                                attributes: user.primaryRole
                            }
                        } : null,
                        userRoles: user.userRoles ? {
                            data: user.userRoles.map(role => ({
                                id: role.id,
                                attributes: role
                            }))
                        } : { data: [] }
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching user:', error);
            ctx.internalServerError('Failed to fetch user');
        }
    },

    /**
     * Update user with primaryRole
     */
    async update(ctx) {
        try {
            const { id } = ctx.params;
            const { data } = ctx.request.body;

            const updatedUser = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').update({
                where: { id },
                data: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    department: data.department,
                    isActive: data.isActive,
                    primaryRole: data.primaryRole
                },
                populate: {
                    primaryRole: true,
                    userRoles: true,
                    department: true
                }
            });

            ctx.send({
                data: {
                    id: updatedUser.id,
                    attributes: {
                        email: updatedUser.email,
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        phone: updatedUser.phone,
                        department: updatedUser.department ? {
                            data: {
                                id: updatedUser.department.id,
                                attributes: updatedUser.department
                            }
                        } : null,
                        isActive: updatedUser.isActive,
                        emailVerified: updatedUser.emailVerified,
                        lastLoginAt: updatedUser.lastLoginAt,
                        createdAt: updatedUser.createdAt,
                        updatedAt: updatedUser.updatedAt,
                        primaryRole: updatedUser.primaryRole ? {
                            data: {
                                id: updatedUser.primaryRole.id,
                                attributes: updatedUser.primaryRole
                            }
                        } : null,
                        userRoles: updatedUser.userRoles ? {
                            data: updatedUser.userRoles.map(role => ({
                                id: role.id,
                                attributes: role
                            }))
                        } : { data: [] }
                    }
                }
            });
        } catch (error) {
            console.error('Error updating user:', error);
            ctx.internalServerError('Failed to update user');
        }
    },

    /**
     * Delete user
     */
    async delete(ctx) {
        try {
            const { id } = ctx.params;

            // Check if user exists
            const user = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').findOne({
                where: { id }
            });

            if (!user) {
                return ctx.notFound('User not found');
            }

            // Delete the user
            await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').delete({
                where: { id }
            });

            // Return success response
            ctx.send({
                data: {
                    id: parseInt(id)
                },
                meta: {}
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            ctx.internalServerError('Failed to delete user');
        }
    }
}));
