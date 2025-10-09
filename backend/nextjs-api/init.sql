-- Initialize database for Xtrawrkx
-- This file is executed when the PostgreSQL container starts

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE xtrawrkx_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'xtrawrkx_db')\gexec

-- Connect to the database
\c xtrawrkx_db;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types and functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create indexes for better performance
-- These will be created after Prisma generates the schema

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE xtrawrkx_db TO xtrawrkx_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO xtrawrkx_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO xtrawrkx_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO xtrawrkx_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO xtrawrkx_user;
