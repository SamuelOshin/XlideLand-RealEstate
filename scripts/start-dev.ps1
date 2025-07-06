# Start Development Environment
Write-Host "🚀 Starting Full Development Environment..." -ForegroundColor Green

# Start backend in background
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\PC\Documents\XlideLand'; .\scripts\start-backend.ps1"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend in background
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd 'C:\Users\PC\Documents\XlideLand'; .\scripts\start-frontend.ps1"

Write-Host "✅ Development servers started!" -ForegroundColor Green
Write-Host "Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C in each terminal to stop the servers" -ForegroundColor Yellow
