# Start Backend Server
Write-Host "🔧 Starting Django Backend Server..." -ForegroundColor Yellow
Set-Location backend
& "venv\Scripts\Activate.ps1"
python manage.py migrate
python manage.py runserver
