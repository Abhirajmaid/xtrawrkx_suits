module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/dashboard/stats',
            handler: 'dashboard.getStats',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'GET',
            path: '/dashboard/recent-activity',
            handler: 'dashboard.getRecentActivity',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};

