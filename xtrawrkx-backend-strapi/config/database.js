const path = require('path');

module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'postgres');

  // Railway provides PostgreSQL connection details through PG* environment variables
  // Map them to DATABASE_* variables if not already set
  const databaseUrl = env('DATABASE_URL') ||
    (env('PGHOST') && env('PGUSER') && env('PGPASSWORD') && env('PGDATABASE') ?
      `postgresql://${env('PGUSER')}:${env('PGPASSWORD')}@${env('PGHOST')}:${env('PGPORT', 5432)}/${env('PGDATABASE')}?sslmode=require` :
      null);

  const connections = {
    mysql: {
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
        },
      },
      pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    },
    postgres: {
      connection: databaseUrl ? {
        connectionString: databaseUrl,
        ssl: {
          rejectUnauthorized: false,
        },
      } : {
        host: env('DATABASE_HOST') || env('PGHOST', 'localhost'),
        port: env.int('DATABASE_PORT') || env.int('PGPORT', 5432),
        database: env('DATABASE_NAME') || env('PGDATABASE', 'strapi'),
        user: env('DATABASE_USERNAME') || env('PGUSER', 'strapi'),
        password: env('DATABASE_PASSWORD') || env('PGPASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', true) && {
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
        },
        schema: env('DATABASE_SCHEMA', 'public'),
      },
      pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    },
    sqlite: {
      connection: {
        filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
