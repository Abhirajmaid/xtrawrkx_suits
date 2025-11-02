'use strict';

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/test/hello',
            handler: 'test.hello',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};
