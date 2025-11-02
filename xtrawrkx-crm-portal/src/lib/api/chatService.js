import strapiClient from '../strapiClient';

class ChatService {
    /**
     * Get chat messages by entity
     */
    async getMessages(entityType, entityId) {
        try {
            const response = await strapiClient.get(`/chat-messages/${entityType}/${entityId}`);
            return response;
        } catch (error) {
            console.error('Error fetching chat messages:', error);
            throw error;
        }
    }

    /**
     * Create a new chat message
     */
    async createMessage(entityType, entityId, message, userId) {
        try {
            const response = await strapiClient.post('/chat-messages', {
                data: {
                    message,
                    entityType,
                    entityId,
                    createdBy: userId
                }
            });
            return response;
        } catch (error) {
            console.error('Error creating chat message:', error);
            throw error;
        }
    }

    /**
     * Update a chat message
     */
    async updateMessage(messageId, message) {
        try {
            const response = await strapiClient.put(`/chat-messages/${messageId}`, {
                data: {
                    message
                }
            });
            return response;
        } catch (error) {
            console.error('Error updating chat message:', error);
            throw error;
        }
    }

    /**
     * Delete a chat message
     */
    async deleteMessage(messageId) {
        try {
            await strapiClient.delete(`/chat-messages/${messageId}`);
            return true;
        } catch (error) {
            console.error('Error deleting chat message:', error);
            throw error;
        }
    }
}

export default new ChatService();

