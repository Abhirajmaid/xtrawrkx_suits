module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors', // Remove the custom config object
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  // 'strapi::session', // Completely remove session middleware
  'strapi::favicon',
  'strapi::public',
  // 'global::authenticate', // Temporarily disabled to allow admin access
];
