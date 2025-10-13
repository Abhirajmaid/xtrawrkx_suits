module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/auth/internal/login',
            handler: 'auth.internalLogin',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/auth/client/login',
            handler: 'auth.clientLogin',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/auth/create-user',
            handler: 'auth.createInternalUser',
            config: {
                policies: [],
                middlewares: ['global::authenticate'],
            },
        },
        {
            method: 'GET',
            path: '/auth/me',
            handler: 'auth.getCurrentUser',
            config: {
                policies: [],
                middlewares: ['global::authenticate'],
            },
        },
        {
            method: 'POST',
            path: '/auth/request-reset',
            handler: 'auth.requestPasswordReset',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/auth/reset-password',
            handler: 'auth.resetPassword',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'GET',
            path: '/auth/me',
            handler: 'auth.getCurrentUser',
            config: {
                policies: [],
                middlewares: ['global::authenticate'],
            },
        },
    ],
};

