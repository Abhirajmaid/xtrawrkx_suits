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
        {
            method: 'GET',
            path: '/chat-messages/threads',
            handler: 'chat-message.findThreads',
            config: {
                auth: false,
            },
        },
        {
            method: 'GET',
            path: '/chat-messages/threads/:id',
            handler: 'chat-message.findThread',
            config: {
                auth: false,
            },
        },
    ],
};



