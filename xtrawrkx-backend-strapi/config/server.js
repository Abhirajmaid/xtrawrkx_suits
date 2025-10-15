module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  // Trust Railway's proxy
  proxy: true,
  // Configure for Railway's HTTPS termination
  url: env('PUBLIC_URL', 'https://xtrawrkxsuits-production.up.railway.app'),
});
