// Debug script to check environment variables
console.log('=== Environment Variables Debug ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_CLIENT:', process.env.DATABASE_CLIENT);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('DATABASE_HOST:', process.env.DATABASE_HOST);
console.log('DATABASE_PORT:', process.env.DATABASE_PORT);
console.log('DATABASE_NAME:', process.env.DATABASE_NAME);
console.log('DATABASE_USERNAME:', process.env.DATABASE_USERNAME);
console.log('DATABASE_PASSWORD:', process.env.DATABASE_PASSWORD ? 'SET' : 'NOT SET');
console.log('DATABASE_SSL:', process.env.DATABASE_SSL);
console.log('DATABASE_SCHEMA:', process.env.DATABASE_SCHEMA);

// Check Railway-specific variables
console.log('\n=== Railway Variables ===');
console.log('PGHOST:', process.env.PGHOST);
console.log('PGPORT:', process.env.PGPORT);
console.log('PGDATABASE:', process.env.PGDATABASE);
console.log('PGUSER:', process.env.PGUSER);
console.log('PGPASSWORD:', process.env.PGPASSWORD ? 'SET' : 'NOT SET');
console.log('RAILWAY_PUBLIC_DOMAIN:', process.env.RAILWAY_PUBLIC_DOMAIN);
console.log('RAILWAY_ENVIRONMENT:', process.env.RAILWAY_ENVIRONMENT);
console.log('PUBLIC_URL:', process.env.PUBLIC_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Test database URL construction
const databaseUrl = process.env.DATABASE_URL ||
    (process.env.PGHOST && process.env.PGUSER && process.env.PGPASSWORD && process.env.PGDATABASE ?
        `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE}?sslmode=require` :
        null);

console.log('\n=== Constructed Database URL ===');
console.log('Database URL:', databaseUrl ? 'CONSTRUCTED' : 'NOT AVAILABLE');

console.log('\n=== All Environment Variables ===');
Object.keys(process.env)
    .filter(key => key.includes('DATABASE') || key.includes('PG') || key.includes('NODE'))
    .forEach(key => console.log(`${key}:`, process.env[key]));

console.log('\n=== Configuration Test ===');
console.log('Testing if configuration files can be loaded...');
try {
    const adminConfig = require('./config/admin.js');
    console.log('Admin config loaded successfully');
    console.log('Session enabled:', adminConfig({ env: process.env }).session?.enabled);
} catch (error) {
    console.log('Error loading admin config:', error.message);
}
