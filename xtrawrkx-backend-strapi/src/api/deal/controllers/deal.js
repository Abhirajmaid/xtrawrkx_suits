'use strict';

/**
 * deal controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::deal.deal', ({ strapi }) => ({
    /**
     * Create a new deal
     */
    async create(ctx) {
        try {
            console.log('Creating deal with data:', ctx.request.body);
            const { data } = ctx.request.body;

            if (!data) {
                console.log('No data provided in request body');
                return ctx.badRequest('No data provided');
            }

            const entity = await strapi.entityService.create('api::deal.deal', {
                data,
                populate: {
                    leadCompany: true,
                    clientAccount: true,
                    contact: true,
                    assignedTo: true,
                    activities: true,
                    proposals: true
                }
            });

            console.log('Created deal:', entity);

            return { data: entity };
        } catch (error) {
            console.error('Deal creation error:', error);
            console.error('Error details:', error.message);
            return ctx.badRequest(`Failed to create deal: ${error.message}`);
        }
    },

    /**
     * Find deals with advanced filtering
     */
    async find(ctx) {
        try {
            console.log('Finding deals with params:', ctx.query);

            const { query } = ctx;

            const populate = {
                leadCompany: true,
                clientAccount: true,
                contact: true,
                assignedTo: true
            };

            const entities = await strapi.entityService.findMany('api::deal.deal', {
                ...query,
                populate
            });

            console.log(`Found ${entities?.length || 0} deals`);

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
            console.error('Deal find error:', error);
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
     * Find one deal by ID
     */
    async findOne(ctx) {
        try {
            const { id } = ctx.params;
            console.log(`Finding deal with ID: ${id}`);

            const entity = await strapi.entityService.findOne('api::deal.deal', id, {
                populate: {
                    leadCompany: true,
                    clientAccount: true,
                    contact: true,
                    assignedTo: true,
                    activities: true,
                    proposals: true,
                    projects: true
                }
            });

            if (!entity) {
                console.log(`Deal with ID ${id} not found`);
                return ctx.notFound(`Deal with ID ${id} not found`);
            }

            return { data: entity };
        } catch (error) {
            console.error(`Deal findOne error for ID ${ctx.params.id}:`, error);
            return ctx.badRequest(`Failed to fetch deal: ${error.message}`);
        }
    },

    /**
     * Update a deal
     */
    async update(ctx) {
        try {
            const { id } = ctx.params;
            const { data } = ctx.request.body;

            console.log(`Updating deal ${id} with data:`, data);

            const entity = await strapi.entityService.update('api::deal.deal', id, {
                data,
                populate: {
                    leadCompany: true,
                    clientAccount: true,
                    contact: true,
                    assignedTo: true,
                    activities: true,
                    proposals: true
                }
            });

            return { data: entity };
        } catch (error) {
            console.error(`Deal update error for ID ${ctx.params.id}:`, error);
            return ctx.badRequest(`Failed to update deal: ${error.message}`);
        }
    },

    /**
     * Delete a deal
     */
    async delete(ctx) {
        try {
            const { id } = ctx.params;
            console.log(`Deleting deal with ID: ${id}`);

            const entity = await strapi.entityService.delete('api::deal.deal', id);

            return { data: entity };
        } catch (error) {
            console.error(`Deal delete error for ID ${ctx.params.id}:`, error);
            return ctx.badRequest(`Failed to delete deal: ${error.message}`);
        }
    },

    /**
     * Get deals by lead company
     */
    async getByLeadCompany(ctx) {
        try {
            const { leadCompanyId } = ctx.params;
            console.log(`Finding deals for lead company: ${leadCompanyId}`);

            const entities = await strapi.entityService.findMany('api::deal.deal', {
                filters: {
                    leadCompany: {
                        id: leadCompanyId
                    }
                },
                populate: {
                    leadCompany: true,
                    contact: true,
                    assignedTo: true,
                    activities: true,
                    proposals: true
                }
            });

            console.log(`Found ${entities?.length || 0} deals for lead company ${leadCompanyId}`);

            return {
                data: entities || [],
                meta: {
                    pagination: {
                        total: entities?.length || 0,
                        page: 1,
                        pageSize: entities?.length || 0,
                        pageCount: 1
                    }
                }
            };
        } catch (error) {
            console.error(`Error fetching deals for lead company ${ctx.params.leadCompanyId}:`, error);
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
     * Get deals by client account
     */
    async getByClientAccount(ctx) {
        try {
            const { clientAccountId } = ctx.params;
            console.log(`Finding deals for client account: ${clientAccountId}`);

            const entities = await strapi.entityService.findMany('api::deal.deal', {
                filters: {
                    clientAccount: {
                        id: clientAccountId
                    }
                },
                populate: {
                    clientAccount: true,
                    contact: true,
                    assignedTo: true,
                    activities: true,
                    proposals: true
                }
            });

            return {
                data: entities || [],
                meta: {
                    pagination: {
                        total: entities?.length || 0,
                        page: 1,
                        pageSize: entities?.length || 0,
                        pageCount: 1
                    }
                }
            };
        } catch (error) {
            console.error(`Error fetching deals for client account ${ctx.params.clientAccountId}:`, error);
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
     * Get deal statistics
     */
    async getStats(ctx) {
        try {
            console.log('Fetching deal statistics');

            const deals = await strapi.entityService.findMany('api::deal.deal', {
                populate: {
                    leadCompany: true,
                    clientAccount: true
                }
            });

            const dealsArray = Array.isArray(deals) ? deals : [];

            const stats = {
                total: dealsArray.length,
                byStage: {
                    DISCOVERY: 0,
                    PROPOSAL: 0,
                    NEGOTIATION: 0,
                    CLOSED_WON: 0,
                    CLOSED_LOST: 0
                },
                byPriority: {
                    LOW: 0,
                    MEDIUM: 0,
                    HIGH: 0
                },
                totalValue: 0,
                averageValue: 0,
                wonDeals: 0,
                lostDeals: 0
            };

            dealsArray.forEach(deal => {
                // Count by stage
                if (deal.stage && stats.byStage.hasOwnProperty(deal.stage)) {
                    stats.byStage[deal.stage]++;
                }

                // Count by priority
                if (deal.priority && stats.byPriority.hasOwnProperty(deal.priority)) {
                    stats.byPriority[deal.priority]++;
                }

                // Calculate totals
                if (deal.value) {
                    stats.totalValue += parseFloat(deal.value);
                }

                if (deal.stage === 'CLOSED_WON') {
                    stats.wonDeals++;
                } else if (deal.stage === 'CLOSED_LOST') {
                    stats.lostDeals++;
                }
            });

            stats.averageValue = dealsArray.length > 0 ? stats.totalValue / dealsArray.length : 0;

            console.log('Deal stats:', stats);

            return { data: stats };
        } catch (error) {
            console.error('Deal stats error:', error);

            return {
                data: {
                    total: 0,
                    byStage: {
                        DISCOVERY: 0,
                        PROPOSAL: 0,
                        NEGOTIATION: 0,
                        CLOSED_WON: 0,
                        CLOSED_LOST: 0
                    },
                    byPriority: {
                        LOW: 0,
                        MEDIUM: 0,
                        HIGH: 0
                    },
                    totalValue: 0,
                    averageValue: 0,
                    wonDeals: 0,
                    lostDeals: 0
                }
            };
        }
    }
}));
