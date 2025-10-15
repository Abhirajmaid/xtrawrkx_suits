module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session', // Restore session middleware
  'strapi::favicon',
  'strapi::public',
  // 'global::authenticate', // Temporarily disabled to allow admin access
];
