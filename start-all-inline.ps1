# PowerShell script to start all apps in background jobs (for Cursor IDE terminal)
Write-Host "🚀 Starting all Xtrawrkx applications in background..." -ForegroundColor Cyan
Write-Host ""

$jobs = @()

# Function to start an app as a background job
function Start-AppJob {
    param(
        [string]$Name,
        [string]$Path,
        [string]$Command
    )
    
    Write-Host "Starting $Name..." -ForegroundColor Yellow
    $job = Start-Job -ScriptBlock {
        param($path, $cmd)
        Set-Location $path
        Invoke-Expression $cmd
    } -ArgumentList (Resolve-Path $Path), $Command
    
    $jobs += @{
        Name = $Name
        Job  = $job
    }
    
    return $job
}

# Start all apps
Start-AppJob -Name "Backend (Strapi)" -Path "xtrawrkx-backend-strapi" -Command "npm run dev"
Start-Sleep -Milliseconds 500

Start-AppJob -Name "CRM Portal" -Path "xtrawrkx-crm-portal" -Command "npm run dev"
Start-Sleep -Milliseconds 500

Start-AppJob -Name "Client Portal" -Path "xtrawrkx-client-portal" -Command "npm run dev"
Start-Sleep -Milliseconds 500

Start-AppJob -Name "Accounts" -Path "xtrawrkx-accounts" -Command "npm run dev"
Start-Sleep -Milliseconds 500

Start-AppJob -Name "PM Dashboard" -Path "xtrawrkx-pm-dashboard" -Command "npm run dev"

Write-Host ""
Write-Host "✅ All applications started in background jobs!" -ForegroundColor Green
Write-Host ""
Write-Host "Applications running on:" -ForegroundColor Cyan
Write-Host "  • Backend (Strapi):     http://localhost:1337" -ForegroundColor White
Write-Host "  • CRM Portal:           http://localhost:3001" -ForegroundColor White
Write-Host "  • Client Portal:        http://localhost:3002" -ForegroundColor White
Write-Host "  • Accounts:             http://localhost:3003" -ForegroundColor White
Write-Host "  • PM Dashboard:         http://localhost:3005" -ForegroundColor White
Write-Host ""
Write-Host "To view job output, use: Get-Job | Receive-Job" -ForegroundColor Gray
Write-Host "To stop all jobs, use: Get-Job | Stop-Job; Get-Job | Remove-Job" -ForegroundColor Gray
Write-Host ""

# Store job IDs for reference
$global:xtrawrkxJobs = $jobs


