module.exports = ({ env }) => ({
    // Trust Railway's proxy
    trustProxy: true,
    // Configure CORS for Railway
    cors: {
        enabled: true,
        headers: '*',
        origin: ['https://xtrawrkxsuits-production.up.railway.app', 'http://localhost:3000'],
    },
    // Configure content security policy
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            'connect-src': ["'self'", 'https:'],
            'img-src': [
                "'self'",
                'data:',
                'blob:',
                'https://xtrawrkxsuits-production.up.railway.app',
            ],
            'media-src': [
                "'self'",
                'data:',
                'blob:',
                'https://xtrawrkxsuits-production.up.railway.app',
            ],
            upgradeInsecureRequests: null,
        },
    },
});
