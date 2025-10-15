'use strict';

/**
 * Dashboard service
 */

module.exports = ({ strapi }) => ({
    /**
     * Calculate dashboard metrics
     */
    async calculateMetrics() {
        try {
            // Get all active users
            const users = await strapi.db.query('api::xtrawrkx-user.xtrawrkx-user').findMany({
                where: { isActive: true },
                populate: {
                    primaryRole: true,
                    userRoles: {
                        populate: {
                            permissions: true
                        }
                    }
                }
            });

            // Calculate basic metrics
            const metrics = {
                totalUsers: users.length,
                activeUsers: users.filter(u => u.isActive).length,
                adminUsers: users.filter(u => {
                    const role = u.primaryRole?.name || u.role;
                    return role === 'ADMIN' || role === 'SUPER_ADMIN';
                }).length,
                mfaEnabledUsers: users.filter(u => u.mfaEnabled === true).length,
            };

            // Calculate role distribution
            const roleDistribution = {};
            users.forEach(user => {
                const roleName = user.primaryRole?.name || user.role || 'Unknown';
                roleDistribution[roleName] = (roleDistribution[roleName] || 0) + 1;
            });

            metrics.roleDistribution = roleDistribution;

            return metrics;
        } catch (error) {
            console.error('Error calculating dashboard metrics:', error);
            throw error;
        }
    },

    /**
     * Get user activity summary
     */
    async getUserActivitySummary(userId, days = 7) {
        try {
            const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

            const activities = await strapi.db.query('api::activity.activity').findMany({
                where: {
                    user: userId,
                    createdAt: {
                        $gte: startDate
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            return {
                totalActivities: activities.length,
                activitiesByType: this.groupActivitiesByType(activities),
                recentActivities: activities.slice(0, 10)
            };
        } catch (error) {
            console.error('Error getting user activity summary:', error);
            throw error;
        }
    },

    /**
     * Group activities by type
     */
    groupActivitiesByType(activities) {
        const grouped = {};
        activities.forEach(activity => {
            const type = activity.type || 'general';
            grouped[type] = (grouped[type] || 0) + 1;
        });
        return grouped;
    }
});

