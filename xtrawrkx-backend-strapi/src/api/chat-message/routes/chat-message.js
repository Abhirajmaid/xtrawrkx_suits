'use strict';

/**
 * chat-message router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::chat-message.chat-message', {
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

const customRoutes = require('./custom-chat');

// Combine default and custom routes
const customRouter = (innerRouter, extraRoutes = []) => {
    let routes;

    return {
        get prefix() {
            return innerRouter.prefix;
        },
        get routes() {
            if (!routes) {
                routes = extraRoutes.routes.concat(innerRouter.routes);
            }
            return routes;
        },
    };
};

module.exports = customRouter(defaultRouter, customRoutes);

