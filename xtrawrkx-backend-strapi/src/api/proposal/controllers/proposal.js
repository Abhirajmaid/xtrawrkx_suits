'use strict';

/**
 * proposal controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::proposal.proposal', ({ strapi }) => ({
    /**
     * Create a new proposal
     */
    async create(ctx) {
        try {
            console.log('Creating proposal with data:', ctx.request.body);
            const { data } = ctx.request.body;

            if (!data) {
                console.log('No data provided in request body');
                return ctx.badRequest('No data provided');
            }

            const entity = await strapi.entityService.create('api::proposal.proposal', {
                data,
                populate: {
                    clientAccount: true,
                    deal: true,
                    contact: true,
                    sentToContact: true,
                    createdBy: true
                }
            });

            console.log('Created proposal:', entity);

            return { data: entity };
        } catch (error) {
            console.error('Proposal creation error:', error);
            console.error('Error details:', error.message);
            return ctx.badRequest(`Failed to create proposal: ${error.message}`);
        }
    },

    /**
     * Find proposals with advanced filtering
     */
    async find(ctx) {
        try {
            console.log('Finding proposals with params:', ctx.query);

            const { query } = ctx;

            const populate = {
                clientAccount: true,
                deal: true,
                contact: true,
                sentToContact: true,
                createdBy: true
            };

            const entities = await strapi.entityService.findMany('api::proposal.proposal', {
                ...query,
                populate
            });

            console.log(`Found ${entities?.length || 0} proposals`);

            if (Array.isArray(entities)) {
                return {
                    data: entities,
                    meta: {
                        pagination: {
                            total: entities.length,
                            page: 1,
                            pageSize: entities.length,
                            pageCount: 1
                        }
                    }
                };
            }

            return entities;
        } catch (error) {
            console.error('Proposal find error:', error);
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
     * Find one proposal by ID
     */
    async findOne(ctx) {
        try {
            const { id } = ctx.params;
            console.log('Finding proposal with ID:', id);

            const entity = await strapi.entityService.findOne('api::proposal.proposal', id, {
                populate: {
                    clientAccount: true,
                    deal: true,
                    contact: true,
                    sentToContact: true,
                    createdBy: true
                }
            });

            if (!entity) {
                return ctx.notFound('Proposal not found');
            }

            return { data: entity };
        } catch (error) {
            console.error('Proposal findOne error:', error);
            return ctx.notFound('Proposal not found');
        }
    },

    /**
     * Update a proposal
     */
    async update(ctx) {
        try {
            const { id } = ctx.params;
            const { data } = ctx.request.body;

            console.log('Updating proposal', id, 'with data:', data);

            if (!data) {
                return ctx.badRequest('No data provided');
            }

            const entity = await strapi.entityService.update('api::proposal.proposal', id, {
                data,
                populate: {
                    clientAccount: true,
                    deal: true,
                    contact: true,
                    sentToContact: true,
                    createdBy: true
                }
            });

            return { data: entity };
        } catch (error) {
            console.error('Proposal update error:', error);
            return ctx.badRequest(`Failed to update proposal: ${error.message}`);
        }
    },

    /**
     * Delete a proposal
     */
    async delete(ctx) {
        try {
            const { id } = ctx.params;
            console.log('Deleting proposal with ID:', id);

            const entity = await strapi.entityService.delete('api::proposal.proposal', id);

            return { data: entity };
        } catch (error) {
            console.error('Proposal delete error:', error);
            return ctx.badRequest(`Failed to delete proposal: ${error.message}`);
        }
    },
}));

