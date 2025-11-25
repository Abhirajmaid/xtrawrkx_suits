// Notification service for PM Dashboard
import apiClient from './apiClient';

class NotificationService {
  /**
   * Get all notifications for the current user
   */
  async getNotifications(userId, options = {}) {
    try {
      const params = {
        'pagination[pageSize]': options.pageSize || 100,
        'filters[user][id][$eq]': userId,
        'sort': 'createdAt:desc',
        populate: ['user'],
      };

      const response = await apiClient.get('/api/notifications', params);
      
      // Handle different response structures
      let notifications = [];
      if (response?.data && Array.isArray(response.data)) {
        notifications = response.data;
      } else if (Array.isArray(response)) {
        notifications = response;
      }

      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Return empty array on error (fallback to localStorage or mock data)
      return [];
    }
  }

  /**
   * Get unread notifications count
   */
  async getUnreadCount(userId) {
    try {
      const notifications = await this.getNotifications(userId);
      return notifications.filter(n => !n.isRead).length;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    try {
      await apiClient.put(`/api/notifications/${notificationId}`, {
        data: {
          isRead: true,
          readAt: new Date().toISOString(),
        },
      });
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Fallback: update locally
      return false;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId) {
    try {
      const notifications = await this.getNotifications(userId);
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      // Mark all unread notifications
      await Promise.all(
        unreadNotifications.map(n => this.markAsRead(n.id))
      );
      
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId) {
    try {
      await apiClient.delete(`/api/notifications/${notificationId}`);
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  /**
   * Format notification time
   */
  formatTime(timestamp) {
    if (!timestamp) return "";
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
   * Transform notification data for frontend
   */
  transformNotification(notification) {
    const user = notification.user || notification.createdBy || {};
    const userName = user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.name || user.email || 'Unknown User';

    return {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      isRead: notification.isRead || false,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
      name: userName,
      initials: this.getInitials(userName),
      timeAgo: this.formatTime(notification.createdAt),
      date: notification.createdAt,
    };
  }
}

export default new NotificationService();


