'use strict';

/**
 * client-account router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

// Create default router with auth disabled
const defaultRouter = createCoreRouter('api::client-account.client-account', {
    config: {
        find: { auth: false },
        findOne: { auth: false },
        create: { auth: false },
        update: { auth: false },
        delete: { auth: false },
    }
});

const customRouter = (innerRouter, extraRoutes = []) => {
    let routes;
    return {
        get prefix() {
            return innerRouter.prefix;
        },
        get routes() {
            if (!routes) {
                // Put custom routes BEFORE default routes to avoid conflicts
                routes = extraRoutes.concat(innerRouter.routes);
            }
            return routes;
        },
    };
};

const myExtraRoutes = [
    {
        method: 'GET',
        path: '/client-accounts/stats',
        handler: 'client-account.getStats',
        config: {
            auth: false,
            policies: [],
            middlewares: [],
        },
    },
    {
        method: 'GET',
        path: '/client-accounts/:id/health',
        handler: 'client-account.getHealthDetails',
        config: {
            auth: false,
            policies: [],
            middlewares: [],
        },
    },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
