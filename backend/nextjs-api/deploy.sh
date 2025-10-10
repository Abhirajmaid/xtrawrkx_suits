#!/bin/bash

# Xtrawrkx Backend Deployment Script for Railway
set -e

echo "🚀 Starting Xtrawrkx Backend Deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Build the application
echo "🏗️ Building application..."
npm run build

# Run database migrations (if DATABASE_URL is set)
if [ -n "$DATABASE_URL" ]; then
    echo "🗄️ Running database migrations..."
    npm run db:migrate || echo "⚠️ Migration failed, continuing..."
else
    echo "⚠️ DATABASE_URL not set, skipping migrations"
fi

echo "✅ Deployment completed successfully!"
