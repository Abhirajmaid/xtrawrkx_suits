# PowerShell script to set up the Xtrawrkx database
# This script sets up PostgreSQL using Docker

Write-Host "🚀 Setting up Xtrawrkx Database..." -ForegroundColor Green

# Check if Docker is running
try {
    docker version | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Navigate to backend directory
Set-Location "backend/nextjs-api"

# Start PostgreSQL and Redis containers
Write-Host "📦 Starting PostgreSQL and Redis containers..." -ForegroundColor Yellow
docker-compose up -d

# Wait for containers to be ready
Write-Host "⏳ Waiting for containers to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if containers are running
$postgresStatus = docker-compose ps postgres | Select-String "Up"
$redisStatus = docker-compose ps redis | Select-String "Up"

if ($postgresStatus -and $redisStatus) {
    Write-Host "✅ Containers are running" -ForegroundColor Green
} else {
    Write-Host "❌ Containers failed to start" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
npm run db:generate

# Push schema to database
Write-Host "📊 Pushing database schema..." -ForegroundColor Yellow
npm run db:push

# Seed database with sample data
Write-Host "🌱 Seeding database with sample data..." -ForegroundColor Yellow
npm run db:seed

Write-Host "🎉 Database setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Start the development server: npm run dev" -ForegroundColor White
Write-Host "2. Open Prisma Studio: npm run db:studio" -ForegroundColor White
Write-Host "3. The API will be available at http://localhost:3004" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Connection details:" -ForegroundColor Cyan
Write-Host "Database: postgresql://xtrawrkx_user:xtrawrkx_password@localhost:5432/xtrawrkx_db" -ForegroundColor White
Write-Host "Redis: redis://localhost:6379" -ForegroundColor White
