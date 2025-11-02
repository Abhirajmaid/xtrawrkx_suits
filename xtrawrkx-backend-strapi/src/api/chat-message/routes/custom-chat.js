'use strict';

/**
 * Custom chat routes
 */

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/chat-messages/:entityType/:entityId',
            handler: 'chat-message.findByEntity',
            config: {
                auth: false,
            },
        },
    ],
};



