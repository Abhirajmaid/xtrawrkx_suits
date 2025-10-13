module.exports = ({ env }) => ({
  auth: {
    secret: 'myAdminJwtSecret123456789012345678901234567890',
  },
  apiToken: {
    salt: 'myApiTokenSalt123456789012345678901234567890',
  },
  transfer: {
    token: {
      salt: 'myTransferTokenSalt123456789012345678901234567890',
    },
  },
  secrets: {
    encryptionKey: 'myEncryptionKey123456789012345678901234567890',
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
