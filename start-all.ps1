# PowerShell script to start all Xtrawrkx applications and backend
Write-Host "🚀 Starting all Xtrawrkx applications..." -ForegroundColor Cyan
Write-Host ""

# Function to start a process in a new window
function Start-App {
    param(
        [string]$Name,
        [string]$Path,
        [string]$Command
    )
    
    Write-Host "Starting $Name..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Path'; $Command" -WindowStyle Normal
    Start-Sleep -Seconds 2
}

# Start Backend (Strapi)
Start-App -Name "Backend (Strapi)" -Path "xtrawrkx-backend-strapi" -Command "npm run dev"

# Start CRM Portal (Port 3001)
Start-App -Name "CRM Portal" -Path "xtrawrkx-crm-portal" -Command "npm run dev"

# Start Client Portal (Port 3002)
Start-App -Name "Client Portal" -Path "xtrawrkx-client-portal" -Command "npm run dev"

# Start Accounts (Port 3003)
Start-App -Name "Accounts" -Path "xtrawrkx-accounts" -Command "npm run dev"

# Start PM Dashboard (Port 3005)
Start-App -Name "PM Dashboard" -Path "xtrawrkx-pm-dashboard" -Command "npm run dev"

Write-Host ""
Write-Host "✅ All applications started!" -ForegroundColor Green
Write-Host ""
Write-Host "Applications running on:" -ForegroundColor Cyan
Write-Host "  • Backend (Strapi):     http://localhost:1337" -ForegroundColor White
Write-Host "  • CRM Portal:           http://localhost:3001" -ForegroundColor White
Write-Host "  • Client Portal:        http://localhost:3002" -ForegroundColor White
Write-Host "  • Accounts:             http://localhost:3003" -ForegroundColor White
Write-Host "  • PM Dashboard:         http://localhost:3005" -ForegroundColor White
Write-Host ""
Write-Host "Each application is running in its own PowerShell window." -ForegroundColor Gray
Write-Host "Close the individual windows to stop each application." -ForegroundColor Gray

