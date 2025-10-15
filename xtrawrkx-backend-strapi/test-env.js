console.log('🔍 TESTING ENVIRONMENT VARIABLES 🔍');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('APP_KEYS:', process.env.APP_KEYS ? 'SET' : 'NOT SET');
console.log('ADMIN_JWT_SECRET:', process.env.ADMIN_JWT_SECRET ? 'SET' : 'NOT SET');
console.log('ENCRYPTION_KEY:', process.env.ENCRYPTION_KEY ? 'SET' : 'NOT SET');
console.log('PUBLIC_URL:', process.env.PUBLIC_URL);
console.log('RAILWAY_PUBLIC_DOMAIN:', process.env.RAILWAY_PUBLIC_DOMAIN);
console.log('🔍 END OF TEST 🔍');
