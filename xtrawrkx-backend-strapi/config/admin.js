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
  // Add session configuration for Railway
  session: {
    enabled: true,
    client: 'cookie',
    key: 'strapi.sid',
    prefix: 'strapi:sess:',
    secretKeys: env.array('APP_KEYS'),
    httpOnly: true,
    secure: false, // Temporarily disable for Railway testing
    maxAge: 86400000,
    overwrite: true,
    signed: true,
    rolling: false,
    renew: false,
  },
});
