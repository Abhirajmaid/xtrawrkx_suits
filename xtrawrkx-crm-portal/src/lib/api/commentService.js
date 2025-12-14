// Comment service for handling all comment-related API operations in CRM
import strapiClient from '../strapiClient';

class CommentService {
    /**
     * Get comments for a lead company
     * @param {string|number} leadCompanyId - Lead Company ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} - Comments data
     */
    async getLeadCompanyComments(leadCompanyId, options = {}) {
        const {
            page = 1,
            pageSize = 100,
            sort = 'createdAt:asc',
            populate = ['user', 'parentComment', 'replies', 'replies.user', 'mentions']
        } = options;

        try {
            const params = {
                'pagination[page]': page,
                'pagination[pageSize]': pageSize,
                sort,
                populate: populate.join(','),
                'filters[commentableType][$eq]': 'LEAD_COMPANY',
                'filters[commentableId][$eq]': leadCompanyId.toString()
            };

            const response = await strapiClient.get('/task-comments', params);
            return response;
        } catch (error) {
            console.error(`Error fetching comments for lead company ${leadCompanyId}:`, error);
            throw error;
        }
    }

    /**
     * Get comments for a client account
     * @param {string|number} clientAccountId - Client Account ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} - Comments data
     */
    async getClientAccountComments(clientAccountId, options = {}) {
        const {
            page = 1,
            pageSize = 100,
            sort = 'createdAt:asc',
            populate = ['user', 'parentComment', 'replies', 'replies.user', 'mentions']
        } = options;

        try {
            const params = {
                'pagination[page]': page,
                'pagination[pageSize]': pageSize,
                sort,
                populate: populate.join(','),
                'filters[commentableType][$eq]': 'CLIENT_ACCOUNT',
                'filters[commentableId][$eq]': clientAccountId.toString()
            };

            const response = await strapiClient.get('/task-comments', params);
            return response;
        } catch (error) {
            console.error(`Error fetching comments for client account ${clientAccountId}:`, error);
            throw error;
        }
    }

    /**
     * Create comment for lead company
     * @param {string|number} leadCompanyId - Lead Company ID
     * @param {string} content - Comment content
     * @param {string|number} userId - User ID
     * @param {Array} mentions - Array of mentioned user IDs
     * @returns {Promise<Object>} - Created comment data
     */
    async createLeadCompanyComment(leadCompanyId, content, userId, mentions = []) {
        try {
            const commentData = {
                commentableType: 'LEAD_COMPANY',
                commentableId: leadCompanyId.toString(),
                content,
                user: userId,
                mentions: mentions.length > 0 ? mentions : null
            };

            const response = await strapiClient.post('/task-comments', {
                data: commentData
            });
            return response.data || response;
        } catch (error) {
            console.error(`Error creating lead company comment for ${leadCompanyId}:`, error);
            throw error;
        }
    }

    /**
     * Create comment for client account
     * @param {string|number} clientAccountId - Client Account ID
     * @param {string} content - Comment content
     * @param {string|number} userId - User ID
     * @param {Array} mentions - Array of mentioned user IDs
     * @returns {Promise<Object>} - Created comment data
     */
    async createClientAccountComment(clientAccountId, content, userId, mentions = []) {
        try {
            const commentData = {
                commentableType: 'CLIENT_ACCOUNT',
                commentableId: clientAccountId.toString(),
                content,
                user: userId,
                mentions: mentions.length > 0 ? mentions : null
            };

            const response = await strapiClient.post('/task-comments', {
                data: commentData
            });
            return response.data || response;
        } catch (error) {
            console.error(`Error creating client account comment for ${clientAccountId}:`, error);
            throw error;
        }
    }

    /**
     * Get comments for a deal
     * @param {string|number} dealId - Deal ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} - Comments data
     */
    async getDealComments(dealId, options = {}) {
        const {
            page = 1,
            pageSize = 100,
            sort = 'createdAt:asc',
            populate = ['user', 'parentComment', 'replies', 'replies.user', 'mentions']
        } = options;

        try {
            const params = {
                'pagination[page]': page,
                'pagination[pageSize]': pageSize,
                sort,
                populate: populate.join(','),
                'filters[commentableType][$eq]': 'DEAL',
                'filters[commentableId][$eq]': dealId.toString()
            };

            const response = await strapiClient.get('/task-comments', params);
            return response;
        } catch (error) {
            console.error(`Error fetching comments for deal ${dealId}:`, error);
            throw error;
        }
    }

    /**
     * Create comment for deal
     * @param {string|number} dealId - Deal ID
     * @param {string} content - Comment content
     * @param {string|number} userId - User ID
     * @param {Array} mentions - Array of mentioned user IDs
     * @returns {Promise<Object>} - Created comment data
     */
    async createDealComment(dealId, content, userId, mentions = []) {
        try {
            const commentData = {
                commentableType: 'DEAL',
                commentableId: dealId.toString(),
                content,
                user: userId,
                mentions: mentions.length > 0 ? mentions : null
            };

            const response = await strapiClient.post('/task-comments', {
                data: commentData
            });
            return response.data || response;
        } catch (error) {
            console.error(`Error creating deal comment for ${dealId}:`, error);
            throw error;
        }
    }

    /**
     * Get comments for a contact
     * @param {string|number} contactId - Contact ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>} - Comments data
     */
    async getContactComments(contactId, options = {}) {
        const {
            page = 1,
            pageSize = 100,
            sort = 'createdAt:asc',
            populate = ['user', 'parentComment', 'replies', 'replies.user', 'mentions']
        } = options;

        try {
            const params = {
                'pagination[page]': page,
                'pagination[pageSize]': pageSize,
                sort,
                populate: populate.join(','),
                'filters[commentableType][$eq]': 'CONTACT',
                'filters[commentableId][$eq]': contactId.toString()
            };

            const response = await strapiClient.get('/task-comments', params);
            return response;
        } catch (error) {
            console.error(`Error fetching comments for contact ${contactId}:`, error);
            throw error;
        }
    }

    /**
     * Create comment for contact
     * @param {string|number} contactId - Contact ID
     * @param {string} content - Comment content
     * @param {string|number} userId - User ID
     * @param {Array} mentions - Array of mentioned user IDs
     * @returns {Promise<Object>} - Created comment data
     */
    async createContactComment(contactId, content, userId, mentions = []) {
        try {
            const commentData = {
                commentableType: 'CONTACT',
                commentableId: contactId.toString(),
                content,
                user: userId,
                mentions: mentions.length > 0 ? mentions : null
            };

            const response = await strapiClient.post('/task-comments', {
                data: commentData
            });
            return response.data || response;
        } catch (error) {
            console.error(`Error creating contact comment for ${contactId}:`, error);
            throw error;
        }
    }

    /**
     * Reply to a comment
     * @param {string|number} parentCommentId - Parent comment ID
     * @param {string} content - Reply content
     * @param {string|number} userId - User ID
     * @returns {Promise<Object>} - Created reply data
     */
    async replyToComment(parentCommentId, content, userId) {
        try {
            // Get parent comment to inherit commentable info
            const parentResponse = await strapiClient.get(`/task-comments/${parentCommentId}`);
            const parentComment = parentResponse.data || parentResponse;
            
            const replyData = {
                commentableType: parentComment.commentableType,
                commentableId: parentComment.commentableId,
                content,
                user: userId,
                parentComment: parentCommentId
            };

            const response = await strapiClient.post('/task-comments', {
                data: replyData
            });
            return response.data || response;
        } catch (error) {
            console.error(`Error replying to comment ${parentCommentId}:`, error);
            throw error;
        }
    }

    /**
     * Update comment
     * @param {string|number} id - Comment ID
     * @param {Object} commentData - Updated comment data
     * @returns {Promise<Object>} - Updated comment data
     */
    async updateComment(id, commentData) {
        try {
            const response = await strapiClient.put(`/task-comments/${id}`, {
                data: commentData
            });
            return response.data || response;
        } catch (error) {
            console.error(`Error updating comment ${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete comment
     * @param {string|number} id - Comment ID
     * @returns {Promise<Object>} - Deleted comment data
     */
    async deleteComment(id) {
        try {
            const response = await strapiClient.delete(`/task-comments/${id}`);
            return response.data || response;
        } catch (error) {
            console.error(`Error deleting comment ${id}:`, error);
            throw error;
        }
    }

    /**
     * Get all comments with optional filtering
     * @param {Object} options - Query options
     * @returns {Promise<Object>} - Comments data
     */
    async getAllComments(options = {}) {
        const {
            page = 1,
            pageSize = 100,
            sort = 'createdAt:desc',
            filters = {},
            populate = ['user', 'parentComment', 'replies', 'replies.user']
        } = options;

        try {
            const params = {
                'pagination[page]': page,
                'pagination[pageSize]': pageSize,
                sort,
                populate: populate.join(',')
            };

            // Add filters
            if (filters.commentableType) {
                params['filters[commentableType][$eq]'] = filters.commentableType;
            }
            if (filters.commentableId) {
                params['filters[commentableId][$eq]'] = filters.commentableId;
            }
            if (filters.parentComment === null || filters.parentComment === undefined) {
                params['filters[parentComment][$null]'] = 'true';
            }

            const response = await strapiClient.get('/task-comments', params);
            return response;
        } catch (error) {
            console.error('Error fetching all comments:', error);
            throw error;
        }
    }
}

// Create and export singleton instance
const commentService = new CommentService();
export default commentService;

