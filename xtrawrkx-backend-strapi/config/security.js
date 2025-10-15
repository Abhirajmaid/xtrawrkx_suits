module.exports = ({ env }) => ({
    // Trust Railway's proxy
    trustProxy: true,
    // Configure CORS for Railway
    cors: {
        enabled: true,
        headers: '*',
        origin: [
            'https://xtrawrkxsuits-production.up.railway.app',
            'http://localhost:3000',
            env('RAILWAY_PUBLIC_DOMAIN') ? `https://${env('RAILWAY_PUBLIC_DOMAIN')}` : null
        ].filter(Boolean),
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
