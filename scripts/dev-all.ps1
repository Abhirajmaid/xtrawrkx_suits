# Run dev servers for each app in separate PowerShell windows
Start-Process pwsh -ArgumentList '-NoExit','-Command','npm --workspace=apps/crm-portal run dev'
Start-Process pwsh -ArgumentList '-NoExit','-Command','npm --workspace=apps/client-portal run dev'
Start-Process pwsh -ArgumentList '-NoExit','-Command','npm --workspace=apps/pm-dashboard run dev'
Write-Host "Started dev windows for CRM(3001), Client Portal(3002), PM(3003). Start Strapi separately in a terminal: cd backend\\strapi ; npm run develop"
