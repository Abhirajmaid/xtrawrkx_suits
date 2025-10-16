'use strict';

/**
 * Department router
 */
module.exports = {
    routes: [
        {
            method: 'GET',
            path: '/departments',
            handler: 'department.find',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'GET',
            path: '/departments/:id',
            handler: 'department.findOne',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/departments',
            handler: 'department.create',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'PUT',
            path: '/departments/:id',
            handler: 'department.update',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'DELETE',
            path: '/departments/:id',
            handler: 'department.delete',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'GET',
            path: '/departments/stats',
            handler: 'department.getStats',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};
