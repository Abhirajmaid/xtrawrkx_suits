'use strict';

/**
 * chat-message controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::chat-message.chat-message', ({ strapi }) => ({
    /**
     * Get messages by entity
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

            const messages = await strapi.entityService.findMany('api::chat-message.chat-message', {
                filters: {
                    [entityField]: {
                        id: { $eq: entityId }
                    },
                    isDeleted: { $eq: false }
                },
                populate: {
                    createdBy: true
                },
                sort: {
                    createdAt: 'asc'
                }
            });

            return { data: messages };
        } catch (error) {
            console.error('Error fetching chat messages:', error);
            return ctx.badRequest(`Failed to fetch chat messages: ${error.message}`);
        }
    },

    /**
     * Create a new chat message
     */
    async create(ctx) {
        try {
            const { data } = ctx.request.body;

            if (!data || !data.message) {
                return ctx.badRequest('Message is required');
            }

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
                return ctx.badRequest('User ID is required to create a message');
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

            // Prepare message data with numeric IDs for relations
            const userRelationIdNum = userRecord.id || parseInt(userRecord.documentId) || parseInt(userId);
            const entityRelationIdNum = entityIdNum;

            const messageData = {
                message: data.message,
                createdBy: userRelationIdNum,
                [entityField]: entityRelationIdNum,
                isDeleted: false,
                isEdited: false
            };

            // Verify schema is loaded correctly
            const contentType = strapi.contentTypes['api::chat-message.chat-message'];
            if (!contentType) {
                return ctx.badRequest('Chat message content type is not registered. Please restart Strapi.');
            }

            const createdByAttribute = contentType.attributes.createdBy;
            if (!createdByAttribute || createdByAttribute.target !== 'api::xtrawrkx-user.xtrawrkx-user') {
                return ctx.badRequest(
                    `Schema relation target mismatch. Expected 'api::xtrawrkx-user.xtrawrkx-user' but found '${createdByAttribute?.target || 'unknown'}'. ` +
                    'Please stop Strapi, delete the .cache folder, and restart Strapi.'
                );
            }

            // Create message
            const message = await strapi.entityService.create('api::chat-message.chat-message', {
                data: messageData
            });

            // Fetch with populated relations
            const populatedMessage = await strapi.entityService.findOne('api::chat-message.chat-message', message.id, {
                populate: {
                    createdBy: true
                }
            });

            return { data: populatedMessage };
        } catch (error) {
            console.error('Error creating chat message:', error);
            
            if (error.message?.includes('relation') || error.message?.includes('admin::user')) {
                return ctx.badRequest(
                    `Failed to create chat message. Please ensure Strapi has been restarted after creating the chat-message schema. Error: ${error.message}`
                );
            }

            return ctx.badRequest(`Failed to create chat message: ${error.message}`);
        }
    },

    /**
     * Update a chat message
     */
    async update(ctx) {
        try {
            const { id } = ctx.params;
            const { data } = ctx.request.body;

            if (!data || !data.message) {
                return ctx.badRequest('Message is required');
            }

            const existingMessage = await strapi.entityService.findOne('api::chat-message.chat-message', id, {
                populate: ['createdBy']
            });

            if (!existingMessage) {
                return ctx.notFound('Message not found');
            }

            // Check ownership
            const userId = ctx.state?.user?.id;
            const createdBy = existingMessage['createdBy'] || {};
            const createdById = createdBy.id || createdBy.documentId;
            
            if (createdById !== userId) {
                return ctx.forbidden('You can only edit your own messages');
            }

            const updatedMessage = await strapi.entityService.update('api::chat-message.chat-message', id, {
                data: {
                    message: data.message,
                    isEdited: true,
                    editedAt: new Date().toISOString()
                },
                populate: {
                    createdBy: true
                }
            });

            return { data: updatedMessage };
        } catch (error) {
            console.error('Error updating chat message:', error);
            return ctx.badRequest(`Failed to update chat message: ${error.message}`);
        }
    },

    /**
     * Delete a chat message (soft delete)
     */
    async delete(ctx) {
        try {
            const { id } = ctx.params;

            const existingMessage = await strapi.entityService.findOne('api::chat-message.chat-message', id, {
                populate: ['createdBy']
            });

            if (!existingMessage) {
                return ctx.notFound('Message not found');
            }

            // Check ownership
            const userId = ctx.state?.user?.id;
            const createdBy = existingMessage['createdBy'] || {};
            const createdById = createdBy.id || createdBy.documentId;
            
            if (createdById !== userId) {
                return ctx.forbidden('You can only delete your own messages');
            }

            // Soft delete
            await strapi.entityService.update('api::chat-message.chat-message', id, {
                data: {
                    isDeleted: true
                }
            });

            return { data: { id } };
        } catch (error) {
            console.error('Error deleting chat message:', error);
            return ctx.badRequest(`Failed to delete chat message: ${error.message}`);
        }
    },
}));
