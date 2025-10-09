#!/bin/bash

# Bash script to set up the Xtrawrkx database
# This script sets up PostgreSQL using Docker

echo "🚀 Setting up Xtrawrkx Database..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is running"

# Navigate to backend directory
cd backend/nextjs-api

# Start PostgreSQL and Redis containers
echo "📦 Starting PostgreSQL and Redis containers..."
docker-compose up -d

# Wait for containers to be ready
echo "⏳ Waiting for containers to be ready..."
sleep 10

# Check if containers are running
if docker-compose ps postgres | grep -q "Up" && docker-compose ps redis | grep -q "Up"; then
    echo "✅ Containers are running"
else
    echo "❌ Containers failed to start"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Push schema to database
echo "📊 Pushing database schema..."
npm run db:push

# Seed database with sample data
echo "🌱 Seeding database with sample data..."
npm run db:seed

echo "🎉 Database setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Open Prisma Studio: npm run db:studio"
echo "3. The API will be available at http://localhost:3004"
echo ""
echo "🔗 Connection details:"
echo "Database: postgresql://xtrawrkx_user:xtrawrkx_password@localhost:5432/xtrawrkx_db"
echo "Redis: redis://localhost:6379"
