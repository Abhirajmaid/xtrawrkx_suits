'use strict';

/**
 * deal-group controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::deal-group.deal-group', ({ strapi }) => ({
    /**
     * Create a new deal group
     */
    async create(ctx) {
        try {
            const { data } = ctx.request.body;

            if (!data || !data.name) {
                return ctx.badRequest('Group name is required');
            }

            // Remove createdBy if it's null or undefined to avoid relation errors
            const cleanData = { ...data };
            if (!cleanData.createdBy) {
                delete cleanData.createdBy;
            }

            const entity = await strapi.entityService.create('api::deal-group.deal-group', {
                data: cleanData,
                populate: {
                    createdBy: true,
                    deals: true
                }
            });

            return { data: entity };
        } catch (error) {
            console.error('Deal group creation error:', error);
            return ctx.badRequest(`Failed to create deal group: ${error.message}`);
        }
    },

    /**
     * Find all deal groups
     */
    async find(ctx) {
        try {
            const { query } = ctx;

            const populate = {
                createdBy: true,
                deals: {
                    populate: {
                        leadCompany: true,
                        clientAccount: true,
                        assignedTo: true
                    }
                }
            };

            const entities = await strapi.entityService.findMany('api::deal-group.deal-group', {
                ...query,
                populate
            });

            return {
                data: entities || [],
                meta: {
                    pagination: {
                        total: Array.isArray(entities) ? entities.length : 0,
                        page: 1,
                        pageSize: Array.isArray(entities) ? entities.length : 0,
                        pageCount: 1
                    }
                }
            };
        } catch (error) {
            console.error('Deal group find error:', error);
            return {
                data: [],
                meta: {
                    pagination: {
                        total: 0,
                        page: 1,
                        pageSize: 0,
                        pageCount: 0
                    }
                }
            };
        }
    },

    /**
     * Find one deal group by ID
     */
    async findOne(ctx) {
        try {
            const { id } = ctx.params;

            const entity = await strapi.entityService.findOne('api::deal-group.deal-group', id, {
                populate: {
                    createdBy: true,
                    deals: {
                        populate: {
                            leadCompany: true,
                            clientAccount: true,
                            assignedTo: true,
                            visibleTo: true
                        }
                    }
                }
            });

            if (!entity) {
                return ctx.notFound(`Deal group with ID ${id} not found`);
            }

            return { data: entity };
        } catch (error) {
            console.error(`Deal group findOne error for ID ${ctx.params.id}:`, error);
            return ctx.badRequest(`Failed to fetch deal group: ${error.message}`);
        }
    },

    /**
     * Update a deal group
     */
    async update(ctx) {
        try {
            const { id } = ctx.params;
            const { data } = ctx.request.body;

            // Remove createdBy if it's null or undefined to avoid relation errors
            const cleanData = { ...data };
            if (!cleanData.createdBy) {
                delete cleanData.createdBy;
            }

            const entity = await strapi.entityService.update('api::deal-group.deal-group', id, {
                data: cleanData,
                populate: {
                    createdBy: true,
                    deals: true
                }
            });

            return { data: entity };
        } catch (error) {
            console.error(`Deal group update error for ID ${ctx.params.id}:`, error);
            return ctx.badRequest(`Failed to update deal group: ${error.message}`);
        }
    },

    /**
     * Delete a deal group
     */
    async delete(ctx) {
        try {
            const { id } = ctx.params;

            const entity = await strapi.entityService.delete('api::deal-group.deal-group', id);

            return { data: entity };
        } catch (error) {
            console.error(`Deal group delete error for ID ${ctx.params.id}:`, error);
            return ctx.badRequest(`Failed to delete deal group: ${error.message}`);
        }
    }
}));


