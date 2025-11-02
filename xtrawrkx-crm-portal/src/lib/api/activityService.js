import strapiClient from '../strapiClient';

class ActivityService {
    /**
     * Get all activities with filtering and pagination
     */
    async getAll(params = {}) {
        try {
            const queryParams = {
                populate: ['createdBy', 'assignee', 'account', 'contact', 'lead', 'deal', 'project', 'task', 'leadCompany', 'clientAccount'],
                ...params
            };

            const response = await strapiClient.getActivities(queryParams);
            return response;
        } catch (error) {
            console.error('Error fetching activities:', error);
            throw error;
        }
    }

    /**
     * Get a single activity by ID
     */
    async getById(id) {
        try {
            const response = await strapiClient.getActivity(id);
            return response.data;
        } catch (error) {
            console.error(`Error fetching activity ${id}:`, error);
            throw error;
        }
    }

    /**
     * Create a new activity
     */
    async create(data) {
        try {
            const response = await strapiClient.createActivity(data);
            return response.data;
        } catch (error) {
            console.error('Error creating activity:', error);
            throw error;
        }
    }

    /**
     * Update an activity
     */
    async update(id, data) {
        try {
            const response = await strapiClient.updateActivity(id, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating activity ${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete an activity
     */
    async delete(id) {
        try {
            await strapiClient.deleteActivity(id);
            return true;
        } catch (error) {
            console.error(`Error deleting activity ${id}:`, error);
            throw error;
        }
    }

    /**
     * Search activities
     */
    async search(searchTerm, filters = {}) {
        try {
            const params = {
                search: searchTerm,
                ...filters,
                populate: ['createdBy', 'assignee', 'contact', 'leadCompany', 'clientAccount']
            };

            const response = await strapiClient.getActivities(params);
            return response;
        } catch (error) {
            console.error('Error searching activities:', error);
            throw error;
        }
    }

    /**
     * Get activities by type
     */
    async getByType(type, params = {}) {
        try {
            const queryParams = {
                type,
                populate: ['createdBy', 'assignee', 'contact'],
                ...params
            };

            const response = await strapiClient.getActivities(queryParams);
            return response;
        } catch (error) {
            console.error(`Error fetching activities by type ${type}:`, error);
            throw error;
        }
    }

    /**
     * Get activities by activity type
     */
    async getByActivityType(activityType, params = {}) {
        try {
            const queryParams = {
                activityType,
                populate: ['createdBy', 'assignee', 'contact'],
                ...params
            };

            const response = await strapiClient.getActivities(queryParams);
            return response;
        } catch (error) {
            console.error(`Error fetching activities by activity type ${activityType}:`, error);
            throw error;
        }
    }

    /**
     * Get activities by status
     */
    async getByStatus(status, params = {}) {
        try {
            const queryParams = {
                status,
                populate: ['createdBy', 'assignee', 'contact'],
                ...params
            };

            const response = await strapiClient.getActivities(queryParams);
            return response;
        } catch (error) {
            console.error(`Error fetching activities by status ${status}:`, error);
            throw error;
        }
    }

    /**
     * Get activities for a lead company
     */
    async getByLeadCompany(leadCompanyId, params = {}) {
        try {
            const queryParams = {
                leadCompany: leadCompanyId,
                populate: ['createdBy', 'assignee', 'contact'],
                sort: 'createdAt:desc',
                ...params
            };

            const response = await strapiClient.getActivities(queryParams);
            return response;
        } catch (error) {
            console.error(`Error fetching activities for lead company ${leadCompanyId}:`, error);
            throw error;
        }
    }

    /**
     * Get activities for a client account
     */
    async getByClientAccount(clientAccountId, params = {}) {
        try {
            const queryParams = {
                clientAccount: clientAccountId,
                populate: ['createdBy', 'assignee', 'contact'],
                sort: 'createdAt:desc',
                ...params
            };

            const response = await strapiClient.getActivities(queryParams);
            return response;
        } catch (error) {
            console.error(`Error fetching activities for client account ${clientAccountId}:`, error);
            throw error;
        }
    }

    /**
     * Get activities for a contact
     */
    async getByContact(contactId, params = {}) {
        try {
            const queryParams = {
                contact: contactId,
                populate: ['createdBy', 'assignee', 'leadCompany', 'clientAccount'],
                sort: 'createdAt:desc',
                ...params
            };

            const response = await strapiClient.getActivities(queryParams);
            return response;
        } catch (error) {
            console.error(`Error fetching activities for contact ${contactId}:`, error);
            throw error;
        }
    }

    /**
     * Get activities assigned to a user
     */
    async getByAssignee(userId, params = {}) {
        try {
            const queryParams = {
                assignee: userId,
                populate: ['createdBy', 'contact', 'leadCompany', 'clientAccount'],
                ...params
            };

            const response = await strapiClient.getActivities(queryParams);
            return response;
        } catch (error) {
            console.error(`Error fetching activities for user ${userId}:`, error);
            throw error;
        }
    }

    /**
     * Get activities created by a user
     */
    async getByCreator(userId, params = {}) {
        try {
            const queryParams = {
                createdBy: userId,
                populate: ['assignee', 'contact', 'leadCompany', 'clientAccount'],
                ...params
            };

            const response = await strapiClient.getActivities(queryParams);
            return response;
        } catch (error) {
            console.error(`Error fetching activities created by user ${userId}:`, error);
            throw error;
        }
    }

    /**
     * Update activity status
     */
    async updateStatus(id, status) {
        try {
            const data = { status };

            if (status === 'COMPLETED') {
                data.completedDate = new Date().toISOString();
            }

            const response = await strapiClient.updateActivity(id, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating activity ${id} status:`, error);
            throw error;
        }
    }

    /**
     * Complete activity
     */
    async complete(id, notes = null) {
        try {
            const data = {
                status: 'COMPLETED',
                completedDate: new Date().toISOString()
            };

            if (notes) {
                const activity = await this.getById(id);
                data.description = `${activity.description || ''}\n\nCompletion Notes: ${notes}`.trim();
            }

            const response = await strapiClient.updateActivity(id, data);
            return response.data;
        } catch (error) {
            console.error(`Error completing activity ${id}:`, error);
            throw error;
        }
    }

    /**
     * Get upcoming activities
     */
    async getUpcoming(days = 7, params = {}) {
        try {
            const today = new Date();
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + days);

            const queryParams = {
                scheduledDate: {
                    $gte: today.toISOString(),
                    $lte: futureDate.toISOString()
                },
                status: {
                    $ne: 'COMPLETED'
                },
                populate: ['assignee', 'contact', 'leadCompany', 'clientAccount'],
                sort: 'scheduledDate:asc',
                ...params
            };

            const response = await strapiClient.getActivities(queryParams);
            return response;
        } catch (error) {
            console.error('Error fetching upcoming activities:', error);
            throw error;
        }
    }

    /**
     * Get overdue activities
     */
    async getOverdue(params = {}) {
        try {
            const today = new Date();

            const queryParams = {
                scheduledDate: {
                    $lt: today.toISOString()
                },
                status: {
                    $ne: 'COMPLETED'
                },
                populate: ['assignee', 'contact', 'leadCompany', 'clientAccount'],
                sort: 'scheduledDate:asc',
                ...params
            };

            const response = await strapiClient.getActivities(queryParams);
            return response;
        } catch (error) {
            console.error('Error fetching overdue activities:', error);
            throw error;
        }
    }

    /**
     * Get today's activities
     */
    async getToday(params = {}) {
        try {
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

            const queryParams = {
                scheduledDate: {
                    $gte: startOfDay.toISOString(),
                    $lt: endOfDay.toISOString()
                },
                populate: ['assignee', 'contact', 'leadCompany', 'clientAccount'],
                sort: 'scheduledDate:asc',
                ...params
            };

            const response = await strapiClient.getActivities(queryParams);
            return response;
        } catch (error) {
            console.error('Error fetching today\'s activities:', error);
            throw error;
        }
    }

    /**
     * Get activity statistics
     */
    async getStats() {
        try {
            const allActivities = await this.getAll({ pagination: { pageSize: 1000 } });

            const stats = {
                total: allActivities.meta?.pagination?.total || 0,
                byType: {},
                byActivityType: {},
                byStatus: {},
                completed: 0,
                pending: 0,
                overdue: 0
            };

            const today = new Date();

            if (allActivities.data) {
                allActivities.data.forEach(activity => {
                    // Count by type
                    stats.byType[activity.type] = (stats.byType[activity.type] || 0) + 1;

                    // Count by activity type
                    stats.byActivityType[activity.activityType] = (stats.byActivityType[activity.activityType] || 0) + 1;

                    // Count by status
                    stats.byStatus[activity.status] = (stats.byStatus[activity.status] || 0) + 1;

                    // Count completed/pending/overdue
                    if (activity.status === 'COMPLETED') {
                        stats.completed++;
                    } else {
                        stats.pending++;

                        if (activity.scheduledDate && new Date(activity.scheduledDate) < today) {
                            stats.overdue++;
                        }
                    }
                });
            }

            return stats;
        } catch (error) {
            console.error('Error fetching activity stats:', error);
            throw error;
        }
    }

    /**
     * Create follow-up activity
     */
    async createFollowUp(originalActivityId, data) {
        try {
            const originalActivity = await this.getById(originalActivityId);

            const followUpData = {
                type: originalActivity.type,
                activityType: data.activityType || 'CALL',
                title: data.title || `Follow-up: ${originalActivity.title}`,
                description: data.description || `Follow-up activity for: ${originalActivity.title}`,
                status: 'PENDING',
                scheduledDate: data.scheduledDate,
                assignee: data.assignee || originalActivity.assignee?.id,
                contact: originalActivity.contact?.id,
                leadCompany: originalActivity.leadCompany?.id,
                clientAccount: originalActivity.clientAccount?.id,
                deal: originalActivity.deal?.id,
                ...data
            };

            const response = await strapiClient.createActivity(followUpData);
            return response.data;
        } catch (error) {
            console.error(`Error creating follow-up for activity ${originalActivityId}:`, error);
            throw error;
        }
    }

    /**
     * Bulk update activities
     */
    async bulkUpdate(ids, data) {
        try {
            const promises = ids.map(id => this.update(id, data));
            const results = await Promise.all(promises);
            return results;
        } catch (error) {
            console.error('Error bulk updating activities:', error);
            throw error;
        }
    }

    /**
     * Log activity automatically
     */
    async logActivity(data) {
        try {
            const activityData = {
                ...data,
                status: 'COMPLETED',
                completedDate: new Date().toISOString()
            };

            const response = await strapiClient.createActivity(activityData);
            return response.data;
        } catch (error) {
            console.error('Error logging activity:', error);
            throw error;
        }
    }

    /**
     * Get activity summary for period
     */
    async getSummaryForPeriod(startDate, endDate, params = {}) {
        try {
            const queryParams = {
                createdAt: {
                    $gte: startDate.toISOString(),
                    $lte: endDate.toISOString()
                },
                populate: ['createdBy', 'assignee'],
                ...params
            };

            const activities = await strapiClient.getActivities(queryParams);

            const summary = {
                period: { startDate, endDate },
                totalActivities: activities.data?.length || 0,
                byType: {},
                byActivityType: {},
                byUser: {},
                completionRate: 0
            };

            if (activities.data) {
                let completedCount = 0;

                activities.data.forEach(activity => {
                    // Count by type
                    summary.byType[activity.type] = (summary.byType[activity.type] || 0) + 1;

                    // Count by activity type
                    summary.byActivityType[activity.activityType] = (summary.byActivityType[activity.activityType] || 0) + 1;

                    // Count by user
                    const userId = activity.createdBy?.id || 'unknown';
                    const userName = activity.createdBy ? `${activity.createdBy.firstName} ${activity.createdBy.lastName}` : 'Unknown';

                    if (!summary.byUser[userId]) {
                        summary.byUser[userId] = {
                            name: userName,
                            count: 0
                        };
                    }
                    summary.byUser[userId].count++;

                    // Count completed
                    if (activity.status === 'COMPLETED') {
                        completedCount++;
                    }
                });

                summary.completionRate = summary.totalActivities > 0
                    ? (completedCount / summary.totalActivities) * 100
                    : 0;
            }

            return summary;
        } catch (error) {
            console.error('Error fetching activity summary:', error);
            throw error;
        }
    }
}

export default new ActivityService();
