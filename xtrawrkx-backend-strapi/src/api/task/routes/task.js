'use strict';

/**
 * task router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::task.task', {
    config: {
        find: {
            auth: false,
            middlewares: [],
        },
        findOne: {
            auth: false,
            middlewares: [],
        },
        create: {
            auth: false,
            middlewares: [],
        },
        update: {
            auth: false,
            middlewares: [],
        },
        delete: {
            auth: false,
            middlewares: [],
        },
    },
});

const customRoutes = require('./custom-task');

// Combine default and custom routes
const customRouter = (innerRouter, extraRoutes = []) => {
    let routes;

    return {
        get prefix() {
            return innerRouter.prefix;
        },
        get routes() {
            if (!routes) {
                // Put custom routes FIRST so they take precedence over default routes
                routes = extraRoutes.routes.concat(innerRouter.routes);
            }
            return routes;
        },
    };
};

module.exports = customRouter(defaultRouter, customRoutes);

