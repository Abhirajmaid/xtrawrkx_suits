'use strict';

/**
 * Custom task routes
 */

module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/tasks/:entityType/:entityId',
            handler: 'task.findByEntity',
            config: {
                auth: false,
            },
        },
        {
            method: 'GET',
            path: '/tasks',
            handler: 'task.findAll',
            config: {
                auth: false,
            },
        },
        {
            method: 'PUT',
            path: '/tasks/:id/status',
            handler: 'task.updateStatus',
            config: {
                auth: false,
            },
        },
    ],
};
