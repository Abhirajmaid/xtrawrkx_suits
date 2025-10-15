'use strict';

/**
 * xtrawrkx-user router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::xtrawrkx-user.xtrawrkx-user', {
    config: {
        find: {
            auth: false,
            policies: [],
            middlewares: [],
        },
        findOne: {
            auth: false,
            policies: [],
            middlewares: [],
        },
        create: {
            auth: false,
            policies: [],
            middlewares: [],
        },
        update: {
            auth: false,
            policies: [],
            middlewares: [],
        },
        delete: {
            auth: false,
            policies: [],
            middlewares: [],
        },
    },
});
