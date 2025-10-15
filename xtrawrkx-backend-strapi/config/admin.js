module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'myAdminJwtSecret123456789012345678901234567890'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'myApiTokenSalt123456789012345678901234567890'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'myTransferTokenSalt123456789012345678901234567890'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY', 'myEncryptionKey123456789012345678901234567890'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  // Add admin panel configuration
  url: '/admin',
  serveAdminPanel: true,
  // Session configuration will be handled by the session middleware
  // No need for custom session config here
  tours: {
    enabled: false,
  },
});
