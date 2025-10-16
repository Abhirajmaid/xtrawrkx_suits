module.exports = ({ env }) => ({
    'users-permissions': {
        config: {
            jwt: {
                expiresIn: '30d',
            },
        },
    },
    // Completely disable Content-Type Builder tours
    'content-type-builder': {
        config: {
            tours: {
                enabled: { koa: false },
            },
        },
    },
    // Add documentation plugin
    'documentation': {
        config: {
            restrictedAccess: { koa: false },
        },
    },
});