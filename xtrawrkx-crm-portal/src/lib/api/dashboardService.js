import strapiClient from '../strapiClient';
import leadCompanyService from './leadCompanyService';
import dealService from './dealService';
import contactService from './contactService';
import activityService from './activityService';

class DashboardService {
    /**
     * Get dashboard statistics
     */
    async getStats() {
        try {
            // Fetch all necessary data in parallel
            const [leadCompanies, deals, contacts, activities] = await Promise.all([
                leadCompanyService.getAll({ pagination: { pageSize: 1000 } }).catch(() => ({ data: [] })),
                dealService.getAll({ pagination: { pageSize: 1000 } }).catch(() => ({ data: [] })),
                contactService.getAll({ pagination: { pageSize: 1000 } }).catch(() => ({ data: [] })),
                activityService.getAll({ pagination: { pageSize: 100 } }).catch(() => ({ data: [] })),
            ]);

            const leadsData = leadCompanies?.data || [];
            const dealsData = deals?.data || [];
            const contactsData = contacts?.data || [];
            const activitiesData = activities?.data || [];

            // Calculate total leads
            const totalLeads = leadsData.length;

            // Calculate pipeline value (sum of all active deals)
            const activeDeals = dealsData.filter(deal => {
                const dealData = deal.attributes || deal;
                const stage = dealData.stage;
                return stage && !['CLOSED_WON', 'CLOSED_LOST'].includes(stage);
            });

            const pipelineValue = activeDeals.reduce((sum, deal) => {
                const dealData = deal.attributes || deal;
                return sum + (parseFloat(dealData.value) || 0);
            }, 0);

            // Calculate conversion rate
            const qualifiedLeads = leadsData.filter(lead => {
                const leadData = lead.attributes || lead;
                return leadData.status === 'QUALIFIED' || leadData.status === 'CONVERTED';
            }).length;

            const conversionRate = totalLeads > 0
                ? Math.round((qualifiedLeads / totalLeads) * 100)
                : 0;

            // Count active deals
            const activeDealsCount = activeDeals.length;

            // Calculate change percentages (compare current month vs last month)
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            
            // Current month data
            const currentMonthLeads = leadsData.filter(lead => {
                const leadData = lead.attributes || lead;
                const createdAt = new Date(leadData.createdAt || lead.createdAt);
                return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
            }).length;
            
            const currentMonthActiveDeals = activeDeals.filter(deal => {
                const dealData = deal.attributes || deal;
                const createdAt = new Date(dealData.createdAt || deal.createdAt);
                return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
            }).length;
            
            // Last month data
            const lastMonthLeads = leadsData.filter(lead => {
                const leadData = lead.attributes || lead;
                const createdAt = new Date(leadData.createdAt || lead.createdAt);
                return createdAt.getMonth() === lastMonth && createdAt.getFullYear() === lastMonthYear;
            }).length;
            
            const lastMonthActiveDeals = activeDeals.filter(deal => {
                const dealData = deal.attributes || deal;
                const createdAt = new Date(dealData.createdAt || deal.createdAt);
                return createdAt.getMonth() === lastMonth && createdAt.getFullYear() === lastMonthYear;
            }).length;
            
            // Calculate changes
            const leadsChange = lastMonthLeads > 0
                ? Math.round(((currentMonthLeads - lastMonthLeads) / lastMonthLeads) * 100)
                : currentMonthLeads > 0 ? 100 : 0;
            
            const dealsChange = lastMonthActiveDeals > 0
                ? Math.round(((currentMonthActiveDeals - lastMonthActiveDeals) / lastMonthActiveDeals) * 100)
                : currentMonthActiveDeals > 0 ? 100 : 0;
            
            // For pipeline value, compare current vs last month closed won deals
            const currentMonthWonDeals = dealsData.filter(deal => {
                const dealData = deal.attributes || deal;
                const createdAt = new Date(dealData.createdAt || deal.createdAt);
                return createdAt.getMonth() === currentMonth && 
                       createdAt.getFullYear() === currentYear &&
                       dealData.stage === 'CLOSED_WON';
            });
            const currentMonthRevenue = currentMonthWonDeals.reduce((sum, deal) => {
                const dealData = deal.attributes || deal;
                return sum + (parseFloat(dealData.value) || 0);
            }, 0);
            
            const lastMonthWonDeals = dealsData.filter(deal => {
                const dealData = deal.attributes || deal;
                const createdAt = new Date(dealData.createdAt || deal.createdAt);
                return createdAt.getMonth() === lastMonth && 
                       createdAt.getFullYear() === lastMonthYear &&
                       dealData.stage === 'CLOSED_WON';
            });
            const lastMonthRevenue = lastMonthWonDeals.reduce((sum, deal) => {
                const dealData = deal.attributes || deal;
                return sum + (parseFloat(dealData.value) || 0);
            }, 0);
            
            const pipelineValueChange = lastMonthRevenue > 0
                ? Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
                : currentMonthRevenue > 0 ? 100 : 0;
            
            // Calculate conversion rate change
            const currentMonthQualified = leadsData.filter(lead => {
                const leadData = lead.attributes || lead;
                const createdAt = new Date(leadData.createdAt || lead.createdAt);
                return createdAt.getMonth() === currentMonth && 
                       createdAt.getFullYear() === currentYear &&
                       (leadData.status === 'QUALIFIED' || leadData.status === 'CONVERTED');
            }).length;
            const currentMonthConversionRate = currentMonthLeads > 0
                ? Math.round((currentMonthQualified / currentMonthLeads) * 100)
                : 0;
            
            const lastMonthQualified = leadsData.filter(lead => {
                const leadData = lead.attributes || lead;
                const createdAt = new Date(leadData.createdAt || lead.createdAt);
                return createdAt.getMonth() === lastMonth && 
                       createdAt.getFullYear() === lastMonthYear &&
                       (leadData.status === 'QUALIFIED' || leadData.status === 'CONVERTED');
            }).length;
            const lastMonthConversionRate = lastMonthLeads > 0
                ? Math.round((lastMonthQualified / lastMonthLeads) * 100)
                : 0;
            
            const conversionRateChange = lastMonthConversionRate > 0
                ? Math.round(((currentMonthConversionRate - lastMonthConversionRate) / lastMonthConversionRate) * 100)
                : currentMonthConversionRate > 0 ? 100 : 0;

            const stats = {
                totalLeads,
                pipelineValue,
                conversionRate,
                activeDeals: activeDealsCount,
                totalContacts: contactsData.length,
                totalActivities: activitiesData.length,
                changes: {
                    leadsChange,
                    pipelineValueChange,
                    conversionRateChange,
                    dealsChange,
                },
            };

            return {
                success: true,
                data: stats,
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            // Return fallback data
            return {
                success: false,
                data: {
                    totalLeads: 0,
                    pipelineValue: 0,
                    conversionRate: 0,
                    activeDeals: 0,
                    totalContacts: 0,
                    totalActivities: 0,
                    changes: {
                        leadsChange: 0,
                        pipelineValueChange: 0,
                        conversionRateChange: 0,
                        dealsChange: 0,
                    },
                },
            };
        }
    }

    /**
     * Get weekly leads data
     */
    async getWeeklyLeadsData() {
        try {
            const leads = await leadCompanyService.getAll({
                pagination: { pageSize: 1000 },
                sort: ['createdAt:desc'],
            });

            const leadsData = leads?.data || [];

            // Group leads by week
            const now = new Date();
            const weeks = [];

            for (let i = 6; i >= 0; i--) {
                const weekEnd = new Date(now);
                weekEnd.setDate(weekEnd.getDate() - (i * 7));
                weekEnd.setHours(23, 59, 59, 999);

                const weekStart = new Date(weekEnd);
                weekStart.setDate(weekStart.getDate() - 6);
                weekStart.setHours(0, 0, 0, 0);

                const weekLeads = leadsData.filter(lead => {
                    const leadData = lead.attributes || lead;
                    const createdAt = new Date(leadData.createdAt || lead.createdAt);
                    return createdAt >= weekStart && createdAt <= weekEnd;
                });

                const qualifiedLeads = weekLeads.filter(lead => {
                    const leadData = lead.attributes || lead;
                    return leadData.status === 'QUALIFIED' || leadData.status === 'CONVERTED';
                });

                weeks.push({
                    name: i === 0 ? 'This Week' : `Week ${7 - i}`,
                    leads: weekLeads.length,
                    qualified: qualifiedLeads.length,
                });
            }

            return weeks;
        } catch (error) {
            console.error('Error fetching weekly leads data:', error);
            return [];
        }
    }

    /**
     * Get pipeline stages data
     */
    async getPipelineStages() {
        try {
            const [leads, deals] = await Promise.all([
                leadCompanyService.getAll({
                    pagination: { pageSize: 1000 },
                    populate: ['assignedTo'],
                }).catch(() => ({ data: [] })),
                dealService.getAll({
                    pagination: { pageSize: 1000 },
                    populate: ['leadCompany', 'contact', 'assignedTo'],
                }).catch(() => ({ data: [] })),
            ]);

            const leadsData = leads?.data || [];
            const dealsData = deals?.data || [];

            // Organize leads by status
            const leadStages = {
                leads: leadsData
                    .filter(lead => {
                        const leadData = lead.attributes || lead;
                        return !leadData.status || leadData.status === 'NEW' || leadData.status === 'ACTIVE';
                    })
                    .map(lead => {
                        const leadData = lead.attributes || lead;
                        const companyName = leadData.companyName || '';
                        const initials = companyName
                            .split(' ')
                            .map(word => word[0])
                            .join('')
                            .substring(0, 2)
                            .toUpperCase() || 'NA';

                        return {
                            id: lead.id || lead.documentId,
                            name: companyName || 'Unknown Company',
                            company: companyName,
                            initials: initials || 'NA',
                            status: 'Initial contact made',
                            value: '₹0',
                            lastActivity: this.getRelativeTime(leadData.createdAt || lead.createdAt),
                        };
                    }),
                qualified: leadsData
                    .filter(lead => {
                        const leadData = lead.attributes || lead;
                        return leadData.status === 'QUALIFIED';
                    })
                    .map(lead => {
                        const leadData = lead.attributes || lead;
                        const companyName = leadData.companyName || '';
                        const initials = companyName
                            .split(' ')
                            .map(word => word[0])
                            .join('')
                            .substring(0, 2)
                            .toUpperCase() || 'NA';

                        return {
                            id: lead.id || lead.documentId,
                            name: companyName || 'Unknown Company',
                            company: companyName,
                            initials: initials || 'NA',
                            status: 'Needs assessment completed',
                            value: '₹0',
                            lastActivity: this.getRelativeTime(leadData.createdAt || lead.createdAt),
                        };
                    }),
            };

            // Organize deals by stage
            const dealStages = {
                proposal: dealsData
                    .filter(deal => {
                        const dealData = deal.attributes || deal;
                        return dealData.stage === 'PROPOSAL';
                    })
                    .map(deal => {
                        const dealData = deal.attributes || deal;
                        const leadCompany = dealData.leadCompany || deal.leadCompany;
                        const contact = dealData.contact || deal.contact;

                        const companyName = leadCompany?.companyName || leadCompany?.attributes?.companyName || 'Unknown Company';
                        const contactName = contact
                            ? `${contact.firstName || ''} ${contact.lastName || ''}`.trim()
                            : companyName;
                        const contactData = contact?.attributes || contact;
                        const initials = contactData?.firstName?.[0] && contactData?.lastName?.[0]
                            ? `${contactData.firstName[0]}${contactData.lastName[0]}`.toUpperCase()
                            : contact?.firstName?.[0] && contact?.lastName?.[0]
                                ? `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase()
                                : companyName
                                    .split(' ')
                                    .map(word => word[0])
                                    .join('')
                                    .substring(0, 2)
                                    .toUpperCase() || 'NA';

                        return {
                            id: deal.id || deal.documentId,
                            name: contactName,
                            company: companyName,
                            initials: initials || 'NA',
                            status: 'Proposal under review',
                            value: `₹${(parseFloat(dealData.value) || 0).toLocaleString('en-IN')}`,
                            lastActivity: this.getRelativeTime(dealData.updatedAt || deal.updatedAt),
                        };
                    }),
                negotiation: dealsData
                    .filter(deal => {
                        const dealData = deal.attributes || deal;
                        return dealData.stage === 'NEGOTIATION';
                    })
                    .map(deal => {
                        const dealData = deal.attributes || deal;
                        const leadCompany = dealData.leadCompany || deal.leadCompany;
                        const contact = dealData.contact || deal.contact;

                        const companyName = leadCompany?.companyName || leadCompany?.attributes?.companyName || 'Unknown Company';
                        const contactName = contact
                            ? `${contact.firstName || ''} ${contact.lastName || ''}`.trim()
                            : companyName;
                        const contactData = contact?.attributes || contact;
                        const initials = contactData?.firstName?.[0] && contactData?.lastName?.[0]
                            ? `${contactData.firstName[0]}${contactData.lastName[0]}`.toUpperCase()
                            : contact?.firstName?.[0] && contact?.lastName?.[0]
                                ? `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase()
                                : companyName
                                    .split(' ')
                                    .map(word => word[0])
                                    .join('')
                                    .substring(0, 2)
                                    .toUpperCase() || 'NA';

                        return {
                            id: deal.id || deal.documentId,
                            name: contactName,
                            company: companyName,
                            initials: initials || 'NA',
                            status: 'Contract terms discussion',
                            value: `₹${(parseFloat(dealData.value) || 0).toLocaleString('en-IN')}`,
                            lastActivity: this.getRelativeTime(dealData.updatedAt || deal.updatedAt),
                        };
                    }),
            };

            return {
                leads: leadStages.leads,
                qualified: leadStages.qualified,
                proposal: dealStages.proposal,
                negotiation: dealStages.negotiation,
            };
        } catch (error) {
            console.error('Error fetching pipeline stages:', error);
            return {
                leads: [],
                qualified: [],
                proposal: [],
                negotiation: [],
            };
        }
    }

    /**
     * Get recent tasks/activities
     */
    async getUpcomingTasks() {
        try {
            const activities = await activityService.getAll({
                pagination: { pageSize: 20 },
                sort: ['createdAt:desc'],
            }).catch(() => ({ data: [] }));

            const activitiesData = activities?.data || [];

            // Transform activities to tasks
            const tasks = activitiesData.slice(0, 4).map((activity, index) => {
                const activityData = activity.attributes || activity;
                const createdAt = new Date(activityData.createdAt || activity.createdAt);
                const now = new Date();
                const daysDiff = Math.ceil((createdAt - now) / (1000 * 60 * 60 * 24));

                let dueDate = 'Today';
                if (daysDiff > 1) {
                    dueDate = createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                } else if (daysDiff === 1) {
                    dueDate = 'Tomorrow';
                }

                return {
                    id: activity.id || activity.documentId || index + 1,
                    title: activityData.action || activityData.description || 'Task',
                    dueDate: dueDate,
                    priority: daysDiff <= 1 ? 'High' : daysDiff <= 3 ? 'Medium' : 'Low',
                    status: activityData.status || 'Pending',
                };
            });

            return tasks;
        } catch (error) {
            console.error('Error fetching upcoming tasks:', error);
            return [];
        }
    }

    /**
     * Get relative time string
     */
    getRelativeTime(dateString) {
        if (!dateString) return 'Unknown';

        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return '1 day ago';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
        return `${Math.floor(diffInDays / 30)} months ago`;
    }
}

export default new DashboardService();

