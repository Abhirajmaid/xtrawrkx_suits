module.exports = ({ env }) => ({
    'users-permissions': {
        enabled: false, // Disable users-permissions plugin for now
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