'use strict';

/**
 * proposal router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::proposal.proposal', {
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

module.exports = defaultRouter;

