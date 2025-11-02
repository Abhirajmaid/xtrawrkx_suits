'use strict';

/**
 * invoice controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::invoice.invoice', ({ strapi }) => ({
    /**
     * Create a new invoice
     */
    async create(ctx) {
        try {
            console.log('Creating invoice with data:', ctx.request.body);
            const { data } = ctx.request.body;

            if (!data) {
                console.log('No data provided in request body');
                return ctx.badRequest('No data provided');
            }

            const entity = await strapi.entityService.create('api::invoice.invoice', {
                data,
                populate: {
                    clientAccount: true,
                    createdBy: true,
                    files: true,
                    items: true
                }
            });

            console.log('Created invoice:', entity);

            return { data: entity };
        } catch (error) {
            console.error('Invoice creation error:', error);
            console.error('Error details:', error.message);
            return ctx.badRequest(`Failed to create invoice: ${error.message}`);
        }
    },

    /**
     * Find invoices with advanced filtering
     */
    async find(ctx) {
        try {
            console.log('Finding invoices with params:', ctx.query);

            const { query } = ctx;

            const populate = {
                clientAccount: true,
                createdBy: true,
                files: true,
                items: true
            };

            const entities = await strapi.entityService.findMany('api::invoice.invoice', {
                ...query,
                populate
            });

            console.log(`Found ${entities?.length || 0} invoices`);

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
            console.error('Invoice find error:', error);
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
     * Find one invoice by ID
     */
    async findOne(ctx) {
        try {
            const { id } = ctx.params;
            console.log('Finding invoice with ID:', id);

            const entity = await strapi.entityService.findOne('api::invoice.invoice', id, {
                populate: {
                    clientAccount: true,
                    createdBy: true,
                    files: true,
                    items: true
                }
            });

            if (!entity) {
                return ctx.notFound('Invoice not found');
            }

            return { data: entity };
        } catch (error) {
            console.error('Invoice findOne error:', error);
            return ctx.notFound('Invoice not found');
        }
    },

    /**
     * Update an invoice
     */
    async update(ctx) {
        try {
            const { id } = ctx.params;
            const { data } = ctx.request.body;

            console.log('Updating invoice', id, 'with data:', data);

            if (!data) {
                return ctx.badRequest('No data provided');
            }

            const entity = await strapi.entityService.update('api::invoice.invoice', id, {
                data,
                populate: {
                    clientAccount: true,
                    createdBy: true,
                    files: true,
                    items: true
                }
            });

            return { data: entity };
        } catch (error) {
            console.error('Invoice update error:', error);
            return ctx.badRequest(`Failed to update invoice: ${error.message}`);
        }
    },

    /**
     * Delete an invoice
     */
    async delete(ctx) {
        try {
            const { id } = ctx.params;
            console.log('Deleting invoice with ID:', id);

            const entity = await strapi.entityService.delete('api::invoice.invoice', id);

            return { data: entity };
        } catch (error) {
            console.error('Invoice delete error:', error);
            return ctx.badRequest(`Failed to delete invoice: ${error.message}`);
        }
    },
}));

