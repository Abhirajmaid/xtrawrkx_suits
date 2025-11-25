// Message service for PM Dashboard
// Handles direct user-to-user messaging
// Currently uses localStorage for persistence, can be swapped with API later

import apiClient from './apiClient';

const STORAGE_KEY = 'xtrawrkx-messages';
const CONVERSATIONS_KEY = 'xtrawrkx-conversations';

class MessageService {
  /**
   * Get storage key for a user
   */
  getStorageKey(userId) {
    return `${STORAGE_KEY}-${userId}`;
  }

  /**
   * Get conversations key for a user
   */
  getConversationsKey(userId) {
    return `${CONVERSATIONS_KEY}-${userId}`;
  }

  /**
   * Get all conversations for the current user
   * Returns list of users the current user has conversations with
   */
  async getConversations(userId) {
    try {
      // Try to get from API first (if implemented)
      try {
        // TODO: Replace with actual API call when backend is ready
        // const response = await apiClient.get(`/api/messages/conversations/${userId}`);
        // return response;
      } catch (apiError) {
        // Fall back to localStorage
      }

      // Get from localStorage
      const conversationsKey = this.getConversationsKey(userId);
      const stored = localStorage.getItem(conversationsKey);
      
      if (stored) {
        return JSON.parse(stored);
      }

      return [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  /**
   * Get messages for a specific conversation (between two users)
   */
  async getConversationMessages(userId1, userId2) {
    try {
      // Try API first
      try {
        // TODO: Replace with actual API call
        // const response = await apiClient.get(`/api/messages/${userId1}/${userId2}`);
        // return response;
      } catch (apiError) {
        // Fall back to localStorage
      }

      // Get from localStorage
      const conversationId = this.getConversationId(userId1, userId2);
      const storageKey = this.getStorageKey(conversationId);
      const stored = localStorage.getItem(storageKey);
      
      if (stored) {
        const messages = JSON.parse(stored);
        return messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }

      return [];
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      return [];
    }
  }

  /**
   * Get conversation ID from two user IDs (consistent ordering)
   */
  getConversationId(userId1, userId2) {
    const ids = [userId1, userId2].map(id => String(id)).sort();
    return `${ids[0]}-${ids[1]}`;
  }

  /**
   * Send a message to another user
   */
  async sendMessage(senderId, recipientId, messageText) {
    try {
      // Try API first
      try {
        // TODO: Replace with actual API call
        // const response = await apiClient.post('/api/messages', {
        //   senderId,
        //   recipientId,
        //   message: messageText,
        // });
        // return response;
      } catch (apiError) {
        // Fall back to localStorage
      }

      // Create message object
      const message = {
        id: Date.now().toString(),
        senderId,
        recipientId,
        message: messageText,
        createdAt: new Date().toISOString(),
        isRead: false,
      };

      // Save to localStorage
      const conversationId = this.getConversationId(senderId, recipientId);
      const storageKey = this.getStorageKey(conversationId);
      const existing = localStorage.getItem(storageKey);
      const messages = existing ? JSON.parse(existing) : [];
      messages.push(message);
      localStorage.setItem(storageKey, JSON.stringify(messages));

      // Update conversations list
      await this.updateConversationList(senderId, recipientId, messageText, message.createdAt);

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Update conversation list for both users
   */
  async updateConversationList(userId1, userId2, lastMessage, timestamp) {
    const updateForUser = async (userId, otherUserId) => {
      const conversationsKey = this.getConversationsKey(userId);
      const stored = localStorage.getItem(conversationsKey);
      const conversations = stored ? JSON.parse(stored) : [];

      // Find or create conversation
      let conversation = conversations.find(c => c.userId === otherUserId);
      
      if (!conversation) {
        // Need to get user info
        const users = await this.getUsers();
        const otherUser = users.find(u => u.id === otherUserId);
        
        if (otherUser) {
          conversation = {
            userId: otherUserId,
            name: otherUser.name,
            initials: this.getInitials(otherUser.name),
            lastMessage: lastMessage,
            timestamp: timestamp,
            unread: userId === userId2, // If this is the recipient, mark as unread
          };
          conversations.unshift(conversation);
        }
      } else {
        // Update existing conversation
        conversation.lastMessage = lastMessage;
        conversation.timestamp = timestamp;
        if (userId === userId2) {
          conversation.unread = true;
        }
        // Move to top
        conversations.splice(conversations.indexOf(conversation), 1);
        conversations.unshift(conversation);
      }

      localStorage.setItem(conversationsKey, JSON.stringify(conversations));
    };

    await updateForUser(userId1, userId2);
    await updateForUser(userId2, userId1);
  }

  /**
   * Get user initials
   */
  getInitials(name) {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  /**
   * Mark conversation as read
   */
  async markAsRead(userId, otherUserId) {
    try {
      const conversationsKey = this.getConversationsKey(userId);
      const stored = localStorage.getItem(conversationsKey);
      if (stored) {
        const conversations = JSON.parse(stored);
        const conversation = conversations.find(c => c.userId === otherUserId);
        if (conversation) {
          conversation.unread = false;
          localStorage.setItem(conversationsKey, JSON.stringify(conversations));
        }
      }

      // Mark messages as read
      const conversationId = this.getConversationId(userId, otherUserId);
      const storageKey = this.getStorageKey(conversationId);
      const storedMessages = localStorage.getItem(storageKey);
      if (storedMessages) {
        const messages = JSON.parse(storedMessages);
        messages.forEach(msg => {
          if (msg.recipientId === userId) {
            msg.isRead = true;
          }
        });
        localStorage.setItem(storageKey, JSON.stringify(messages));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }

  /**
   * Get all users for starting new conversations
   */
  async getUsers() {
    try {
      const response = await apiClient.get('/api/xtrawrkx-users', {
        'pagination[pageSize]': 100,
        'filters[isActive][$eq]': 'true',
        populate: 'primaryRole',
      });

      let usersData = [];
      if (response?.data && Array.isArray(response.data)) {
        usersData = response.data;
      } else if (Array.isArray(response)) {
        usersData = response;
      }

      return usersData.map((user) => {
        const userData = user.attributes || user;
        const firstName = userData.firstName || '';
        const lastName = userData.lastName || '';
        const email = userData.email || '';
        const name = `${firstName} ${lastName}`.trim() || email || 'Unknown User';

        return {
          id: user.id,
          firstName,
          lastName,
          email,
          name,
        };
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      // Return empty array on error
      return [];
    }
  }

  /**
   * Format relative time
   */
  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }
}

export default new MessageService();

