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
  // Add tours configuration to fix the "Cannot read properties of undefined (reading 'tours')" error
  tours: {
    enabled: false, // Disable tours to prevent the error
  },
  // Add Content-Type Builder configuration
  'content-type-builder': {
    tours: {
      enabled: false, // Disable CTB tours specifically
    },
  },
  // Session configuration will be handled by the session middleware
  // No need for custom session config here
});
