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
            path: '/onboarding/login',
            handler: 'onboarding.clientLogin',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/onboarding/basics',
            handler: 'onboarding.updateBasics',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/onboarding/communities',
            handler: 'onboarding.updateCommunities',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/onboarding/submission',
            handler: 'onboarding.submitCommunityApplication',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'GET',
            path: '/onboarding/account',
            handler: 'onboarding.getAccountData',
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

