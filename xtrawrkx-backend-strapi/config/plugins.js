module.exports = ({ env }) => ({
    'users-permissions': {
        config: {
            jwt: {
                expiresIn: '30d',
            },
        },
    },
    'content-type-builder': {
        config: {
            tours: {
                enabled: false,
                // Add complete tour structure to prevent undefined access
                defaultTour: {
                    enabled: false,
                    steps: [],
                },
                tours: [], // Empty array to prevent undefined access
            },
        },
    },
});