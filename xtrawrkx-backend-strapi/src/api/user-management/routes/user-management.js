module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/user-management/create-user',
            handler: 'user-management.createUser',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'GET',
            path: '/user-management/editable-users',
            handler: 'user-management.getEditableUsers',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'PUT',
            path: '/user-management/users/:userId',
            handler: 'user-management.updateUser',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};
