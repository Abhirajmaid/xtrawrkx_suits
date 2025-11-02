'use strict';

/**
 * deal router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

// Create the default router
const defaultRouter = createCoreRouter('api::deal.deal', {
    config: {
        find: { auth: false },
        findOne: { auth: false },
        create: { auth: false },
        update: { auth: false },
        delete: { auth: false }
    }
});

// Custom routes
const myExtraRoutes = [
    {
        method: 'GET',
        path: '/deals/stats',
        handler: 'deal.getStats',
        config: {
            auth: false,
        },
    },
    {
        method: 'GET',
        path: '/deals/lead-company/:leadCompanyId',
        handler: 'deal.getByLeadCompany',
        config: {
            auth: false,
        },
    },
    {
        method: 'GET',
        path: '/deals/client-account/:clientAccountId',
        handler: 'deal.getByClientAccount',
        config: {
            auth: false,
        },
    }
];

// Custom router function to combine default and custom routes
const customRouter = (innerRouter, extraRoutes = []) => {
    let routes;

    return {
        get prefix() {
            return innerRouter.prefix;
        },
        get routes() {
            if (!routes) {
                routes = extraRoutes.concat(innerRouter.routes);
            }
            return routes;
        },
    };
};

module.exports = customRouter(defaultRouter, myExtraRoutes);
