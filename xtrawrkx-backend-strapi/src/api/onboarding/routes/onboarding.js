module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/onboarding/complete',
            handler: 'onboarding.completeOnboarding',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/onboarding/add-contact',
            handler: 'onboarding.addContact',
            config: {
                policies: [],
                middlewares: ['global::authenticate'],
            },
        },
        {
            method: 'GET',
            path: '/onboarding/contacts',
            handler: 'onboarding.getAccountContacts',
            config: {
                policies: [],
                middlewares: ['global::authenticate'],
            },
        },
    ],
};

