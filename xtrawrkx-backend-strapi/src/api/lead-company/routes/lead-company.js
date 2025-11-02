'use strict';

/**
 * lead-company router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

// Create default router with auth disabled
const defaultRouter = createCoreRouter('api::lead-company.lead-company', {
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
        method: 'POST',
        path: '/lead-companies/:id/convert',
        handler: 'lead-company.convertToClient',
        config: {
            auth: false,
            policies: [],
            middlewares: [],
        },
    },
    {
        method: 'GET',
        path: '/lead-companies/stats',
        handler: 'lead-company.getStats',
        config: {
            auth: false,
            policies: [],
            middlewares: [],
        },
    },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
