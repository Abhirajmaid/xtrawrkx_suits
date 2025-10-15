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
                enabled: false, // Disable CTB tours to prevent the error
            },
        },
    },
});