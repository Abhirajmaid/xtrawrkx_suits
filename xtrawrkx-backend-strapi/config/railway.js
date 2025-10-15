module.exports = ({ env }) => ({
    // Railway-specific configuration
    proxy: true,
    trustProxy: true,

    // Use Railway's environment variables
    url: env('RAILWAY_PUBLIC_DOMAIN') ? `https://${env('RAILWAY_PUBLIC_DOMAIN')}` : env('PUBLIC_URL'),

    // Session configuration for Railway
    session: {
        secure: false, // Disable secure cookies for Railway
        sameSite: 'lax',
        httpOnly: true,
    },

    // CORS configuration for Railway
    cors: {
        origin: [
            env('RAILWAY_PUBLIC_DOMAIN') ? `https://${env('RAILWAY_PUBLIC_DOMAIN')}` : null,
            'https://xtrawrkxsuits-production.up.railway.app',
            'http://localhost:3000'
        ].filter(Boolean),
        credentials: true,
    },
});
