'use strict';

/**
 * task-comment controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::task-comment.task-comment', ({ strapi }) => ({
    /**
     * Get all comments with optional filtering
     */
    async find(ctx) {
        try {
            const { query } = ctx;

            // Debug: Log the entire query object to see how Strapi parses it
            console.log('=== Comment find query ===');
            console.log('Full query object:', JSON.stringify(query, null, 2));
            console.log('Query keys:', Object.keys(query));
            console.log('Request URL:', ctx.request.url);
            console.log('Raw query string:', ctx.request.url.split('?')[1]);

            // Parse populate from query string
            let populate = {
                user: true,
                parentComment: true,
                replies: true
            };

            if (query.populate) {
                const populateFields = typeof query.populate === 'string'
                    ? query.populate.split(',')
                    : Array.isArray(query.populate)
                        ? query.populate
                        : [];

                // Build populate object
                const customPopulate = {};
                populateFields.forEach(field => {
                    const trimmedField = field.trim();
                    if (trimmedField) {
                        // Handle nested populate like "replies.user"
                        if (trimmedField.includes('.')) {
                            const [parent, child] = trimmedField.split('.');
                            customPopulate[parent] = { populate: { [child]: true } };
                        } else {
                            customPopulate[trimmedField] = true;
                        }
                    }
                });

                // Merge with default
                populate = { ...populate, ...customPopulate };
            }

            // Parse filters - Strapi automatically parses query string filters
            const filters = {};

            // Try multiple ways to access filters (Strapi may parse them differently)
            // Method 1: Direct bracket notation (URL encoded)
            let commentableTypeFilter = query['filters[commentableType][$eq]'];
            let commentableIdFilter = query['filters[commentableId][$eq]'];
            
            // Method 2: Check if Strapi parsed it into a nested object
            if (!commentableTypeFilter && query.filters && query.filters.commentableType) {
                commentableTypeFilter = query.filters.commentableType.$eq || query.filters.commentableType;
            }
            if (!commentableIdFilter && query.filters && query.filters.commentableId) {
                commentableIdFilter = query.filters.commentableId.$eq || query.filters.commentableId;
            }

            // Method 3: Parse from raw query string if still not found
            if (!commentableTypeFilter || !commentableIdFilter) {
                const queryString = ctx.request.url.split('?')[1];
                if (queryString) {
                    const params = new URLSearchParams(queryString);
                    // URLSearchParams automatically decodes, so we can check both encoded and decoded versions
                    for (const [key, value] of params.entries()) {
                        if (key === 'filters[commentableType][$eq]' || key.includes('commentableType')) {
                            commentableTypeFilter = commentableTypeFilter || value;
                        }
                        if (key === 'filters[commentableId][$eq]' || key.includes('commentableId')) {
                            commentableIdFilter = commentableIdFilter || value;
                        }
                    }
                }
            }

            console.log('Filter values found:', {
                commentableTypeFilter,
                commentableIdFilter,
                hasFiltersObject: !!query.filters,
                filtersObject: query.filters,
                directAccess: {
                    bracketType: query['filters[commentableType][$eq]'],
                    bracketId: query['filters[commentableId][$eq]']
                }
            });

            // Handle filters from query string (Strapi format: filters[field][$operator]=value)
            if (commentableTypeFilter) {
                // Use direct value for equality (Strapi v4 format)
                filters.commentableType = String(commentableTypeFilter).toUpperCase();
            }
            if (commentableIdFilter) {
                // Store as string for consistent matching - use direct value for equality
                filters.commentableId = String(commentableIdFilter);
            }
            if (query['filters[parentComment][$null]'] === 'true' || query['filters[parentComment][$null]'] === true) {
                filters.parentComment = { $null: true };
            }
            if (query['filters[parentComment][id][$eq]']) {
                const parentId = parseInt(String(query['filters[parentComment][id][$eq]']), 10);
                if (!isNaN(parentId)) {
                    filters.parentComment = { id: parentId };
                }
            }

            // Parse pagination
            const page = parseInt(String(query['pagination[page]'] || query.page || '1'), 10);
            const pageSize = parseInt(String(query['pagination[pageSize]'] || query.pageSize || '100'), 10);

            // Parse sort - use string format that Strapi expects
            const sortStr = (query.sort && typeof query.sort === 'string') ? query.sort : 'createdAt:asc';

            // Build query options
            const queryOptions = {
                populate,
                pagination: { page, pageSize }
            };

            // Add filters if any
            if (Object.keys(filters).length > 0) {
                queryOptions.filters = filters;
            }

            // Add sort
            queryOptions.sort = sortStr;

            console.log('Fetching comments with query options:', JSON.stringify(queryOptions, null, 2));

            // Use entityService to find comments
            const { results, pagination: paginationInfo } = await strapi.entityService.findPage('api::task-comment.task-comment', queryOptions);

            console.log('Comments found:', {
                count: results.length,
                commentableTypeFilter: commentableTypeFilter || 'none',
                commentableIdFilter: query['filters[commentableId][$eq]'] || 'none',
                filtersApplied: filters,
                sampleResults: results.slice(0, 3).map(r => ({
                    id: r.id,
                    commentableType: r.commentableType,
                    commentableId: r.commentableId,
                    content: r.content?.substring(0, 50)
                }))
            });

            return {
                data: results,
                meta: {
                    pagination: paginationInfo
                }
            };
        } catch (error) {
            console.error('Error fetching comments:', error);
            return ctx.badRequest(`Failed to fetch comments: ${error.message}`);
        }
    },

    /**
     * Get a single comment by ID
     */
    async findOne(ctx) {
        try {
            const { id } = ctx.params;
            const { query } = ctx;

            // Parse populate
            let populate = {
                user: true,
                parentComment: true,
                replies: true
            };

            if (query.populate) {
                const populateFields = typeof query.populate === 'string'
                    ? query.populate.split(',')
                    : Array.isArray(query.populate)
                        ? query.populate
                        : [];

                const customPopulate = {};
                populateFields.forEach(field => {
                    const trimmedField = field.trim();
                    if (trimmedField) {
                        if (trimmedField.includes('.')) {
                            const [parent, child] = trimmedField.split('.');
                            customPopulate[parent] = { populate: { [child]: true } };
                        } else {
                            customPopulate[trimmedField] = true;
                        }
                    }
                });

                populate = { ...populate, ...customPopulate };
            }

            const comment = await strapi.entityService.findOne('api::task-comment.task-comment', id, {
                populate
            });

            if (!comment) {
                return ctx.notFound('Comment not found');
            }

            return { data: comment };
        } catch (error) {
            console.error('Error fetching comment:', error);
            return ctx.badRequest(`Failed to fetch comment: ${error.message}`);
        }
    },

    /**
     * Create a new comment
     */
    async create(ctx) {
        try {
            const { data } = ctx.request.body;

            if (!data) {
                return ctx.badRequest('Data is required');
            }

            // Validate required fields
            if (!data.commentableType || !data.commentableId || !data.content) {
                return ctx.badRequest('commentableType, commentableId, and content are required');
            }

            if (!['TASK', 'SUBTASK'].includes(data.commentableType)) {
                return ctx.badRequest('commentableType must be either TASK or SUBTASK');
            }

            // Handle user - user is required
            if (!data.user) {
                return ctx.badRequest('User is required to create a comment');
            }

            let userId = typeof data.user === 'string' ? parseInt(data.user, 10) : data.user;
            if (isNaN(userId)) {
                return ctx.badRequest('Invalid user ID');
            }

            const user = await strapi.entityService.findOne('api::xtrawrkx-user.xtrawrkx-user', userId);
            if (!user) {
                return ctx.badRequest(`User with ID ${userId} not found`);
            }

            // Handle parent comment if provided
            let parentCommentId = null;
            if (data.parentComment) {
                parentCommentId = typeof data.parentComment === 'string'
                    ? parseInt(data.parentComment, 10)
                    : data.parentComment;
                const parentComment = await strapi.entityService.findOne('api::task-comment.task-comment', parentCommentId);
                if (!parentComment) {
                    return ctx.badRequest('Parent comment not found');
                }
            }

            // Build comment data
            const commentData = {
                commentableType: data.commentableType,
                commentableId: data.commentableId.toString(),
                content: data.content,
                user: userId,
                parentComment: parentCommentId,
                mentions: data.mentions || null
            };

            // Create comment
            console.log('Creating comment with data:', commentData);
            const createdComment = await strapi.entityService.create('api::task-comment.task-comment', {
                data: commentData,
                populate: {
                    user: true,
                    parentComment: true,
                    replies: true
                }
            });

            console.log('Comment created successfully:', {
                id: createdComment.id,
                commentableType: createdComment.commentableType,
                commentableId: createdComment.commentableId,
                content: createdComment.content
            });

            // Verify the comment was actually saved by fetching it back
            const verifiedComment = await strapi.entityService.findOne('api::task-comment.task-comment', createdComment.id, {
                populate: {
                    user: true,
                    parentComment: true,
                    replies: true
                }
            });

            if (!verifiedComment) {
                console.error('Comment was created but could not be verified in database');
                return ctx.internalServerError('Comment was created but could not be verified');
            }

            console.log('Comment verified in database:', verifiedComment.id);

            return { data: verifiedComment };
        } catch (error) {
            console.error('Error creating comment:', error);
            console.error('Error stack:', error.stack);
            return ctx.internalServerError(`Failed to create comment: ${error.message}`);
        }
    },

    /**
     * Update a comment
     */
    async update(ctx) {
        try {
            const { id } = ctx.params;
            const { data } = ctx.request.body;

            if (!data) {
                return ctx.badRequest('Data is required');
            }

            // Get existing comment
            const existingComment = await strapi.entityService.findOne('api::task-comment.task-comment', id);
            if (!existingComment) {
                return ctx.notFound('Comment not found');
            }

            const updateData = { ...data };

            // Handle user update if provided
            if (data.user !== undefined) {
                if (data.user) {
                    const userId = typeof data.user === 'string' ? parseInt(data.user, 10) : data.user;
                    const user = await strapi.entityService.findOne('api::xtrawrkx-user.xtrawrkx-user', userId);
                    if (user) {
                        updateData.user = userId;
                    } else {
                        delete updateData.user;
                    }
                } else {
                    updateData.user = null;
                }
            }

            // Update comment
            const updatedComment = await strapi.entityService.update('api::task-comment.task-comment', id, {
                data: updateData,
                populate: {
                    user: true,
                    parentComment: true,
                    replies: true
                }
            });

            return { data: updatedComment };
        } catch (error) {
            console.error('Error updating comment:', error);
            return ctx.badRequest(`Failed to update comment: ${error.message}`);
        }
    },

    /**
     * Delete a comment
     */
    async delete(ctx) {
        try {
            const { id } = ctx.params;

            const comment = await strapi.entityService.findOne('api::task-comment.task-comment', id);
            if (!comment) {
                return ctx.notFound('Comment not found');
            }

            // Delete comment (replies will be handled by database constraints or manually)
            await strapi.entityService.delete('api::task-comment.task-comment', id);

            return { data: comment };
        } catch (error) {
            console.error('Error deleting comment:', error);
            return ctx.badRequest(`Failed to delete comment: ${error.message}`);
        }
    }
}));

