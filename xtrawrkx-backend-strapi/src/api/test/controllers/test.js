'use strict';

module.exports = {
    async hello(ctx) {
        ctx.body = {
            message: 'Hello from Strapi!',
            timestamp: new Date().toISOString(),
            path: ctx.request.path
        };
    },
};
