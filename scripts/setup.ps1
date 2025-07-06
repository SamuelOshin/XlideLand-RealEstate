# XlideLand Project Setup Script (PowerShell)
# This script sets up the development environment for the full-stack real estate application

param(
    [switch]$SkipChecks
)

Write-Host "🏠 XlideLand Real Estate - Development Setup" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "IMPLEMENTATION_GUIDE.md")) {
    Write-Host "❌ Error: Please run this script from the XlideLand root directory" -ForegroundColor Red
    exit 1
}

# Function to check if a command exists
function Test-CommandExists {
    param($Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Check prerequisites
if (-not $SkipChecks) {
    Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

    if (-not (Test-CommandExists "python")) {
        Write-Host "❌ Python is required but not installed" -ForegroundColor Red
        Write-Host "Please install Python 3.11+ from https://python.org" -ForegroundColor Yellow
        exit 1
    }

    if (-not (Test-CommandExists "node")) {
        Write-Host "❌ Node.js is required but not installed" -ForegroundColor Red
        Write-Host "Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Yellow
        exit 1
    }

    if (-not (Test-CommandExists "git")) {
        Write-Host "❌ Git is required but not installed" -ForegroundColor Red
        Write-Host "Please install Git from https://git-scm.com" -ForegroundColor Yellow
        exit 1
    }

    Write-Host "✅ Prerequisites check passed" -ForegroundColor Green
}

# Setup Backend
Write-Host ""
Write-Host "🔧 Setting up Backend (Django REST API)..." -ForegroundColor Yellow
Set-Location backend

# Create virtual environment
if (-not (Test-Path "venv")) {
    Write-Host "📦 Creating Python virtual environment..." -ForegroundColor Cyan
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create virtual environment" -ForegroundColor Red
        exit 1
    }
}

# Activate virtual environment
Write-Host "🔌 Activating virtual environment..." -ForegroundColor Cyan
& "venv\Scripts\Activate.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to activate virtual environment" -ForegroundColor Red
    exit 1
}

# Create requirements directory structure
New-Item -ItemType Directory -Force -Path "requirements" | Out-Null

# Create base requirements file
@"
Django>=4.2.0,<5.0.0
djangorestframework>=3.14.0
djangorestframework-simplejwt>=5.2.0
django-cors-headers>=4.0.0
django-filter>=23.0
drf-spectacular>=0.26.0
Pillow>=10.0.0
python-dotenv>=1.0.0
psycopg2-binary>=2.9.0
redis>=4.5.0
celery>=5.3.0
"@ | Out-File -FilePath "requirements\base.txt" -Encoding UTF8

# Create development requirements
@"
-r base.txt
pytest>=7.4.0
pytest-django>=4.5.0
pytest-cov>=4.1.0
black>=23.7.0
flake8>=6.0.0
mypy>=1.5.0
django-debug-toolbar>=4.2.0
factory-boy>=3.3.0
"@ | Out-File -FilePath "requirements\development.txt" -Encoding UTF8

# Create production requirements
@"
-r base.txt
gunicorn>=21.2.0
whitenoise>=6.5.0
sentry-sdk>=1.32.0
django-storages>=1.13.0
boto3>=1.28.0
"@ | Out-File -FilePath "requirements\production.txt" -Encoding UTF8

# Install requirements
Write-Host "📦 Installing Python dependencies..." -ForegroundColor Cyan
python -m pip install --upgrade pip
pip install -r requirements\development.txt

# Create .env.example file
@"
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Settings
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=

# Email Settings
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
DEFAULT_FROM_EMAIL=

# JWT Settings
JWT_ACCESS_TOKEN_LIFETIME=60  # minutes
JWT_REFRESH_TOKEN_LIFETIME=1440  # minutes (24 hours)

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Media Storage (for production)
USE_S3=False
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=
AWS_S3_REGION_NAME=
"@ | Out-File -FilePath ".env.example" -Encoding UTF8

# Copy .env.example to .env
Copy-Item ".env.example" ".env"

Write-Host "✅ Backend setup completed" -ForegroundColor Green

# Setup Frontend
Write-Host ""
Write-Host "🎨 Setting up Frontend (Next.js)..." -ForegroundColor Yellow
Set-Location ..\frontend

# Check if package.json exists, if not create the Next.js project
if (-not (Test-Path "package.json")) {
    Write-Host "📦 Creating Next.js project..." -ForegroundColor Cyan
    npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
}

# Install additional dependencies
Write-Host "📦 Installing additional dependencies..." -ForegroundColor Cyan
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-toast
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install axios "@tanstack/react-query" zustand
npm install react-hook-form @hookform/resolvers zod
npm install framer-motion swiper
npm install next-auth

# Install development dependencies
npm install --save-dev @types/node @types/react @types/react-dom
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev eslint-config-prettier prettier
npm install --save-dev "@playwright/test"

# Create .env.local.example
@"
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_MEDIA_URL=http://localhost:8000/media

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# External Services
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_ANALYTICS_ID=
"@ | Out-File -FilePath ".env.local.example" -Encoding UTF8

# Copy .env.local.example to .env.local
Copy-Item ".env.local.example" ".env.local"

# Initialize Shadcn UI
Write-Host "🎨 Setting up Shadcn UI..." -ForegroundColor Cyan
npx shadcn-ui@latest init --yes --defaults

# Add essential Shadcn UI components
npx shadcn-ui@latest add button input card dialog select sheet navigation-menu badge

Write-Host "✅ Frontend setup completed" -ForegroundColor Green

# Setup Documentation
Write-Host ""
Write-Host "📚 Setting up Documentation..." -ForegroundColor Yellow
Set-Location ..\docs

# Create API.md if it doesn't exist
if (-not (Test-Path "API.md")) {
    @"
# API Documentation

## Overview
This document describes the REST API endpoints for the XlideLand Real Estate application.

## Base URL
- Development: ``http://localhost:8000/api``
- Production: ``https://api.xlideland.com``

## Authentication
The API uses JWT (JSON Web Tokens) for authentication.

### Endpoints

#### Authentication
- ``POST /auth/register/`` - User registration
- ``POST /auth/login/`` - User login
- ``POST /auth/refresh/`` - Refresh JWT token
- ``POST /auth/logout/`` - User logout

#### Listings
- ``GET /listings/`` - Get all listings
- ``POST /listings/`` - Create a new listing (admin only)
- ``GET /listings/{id}/`` - Get listing details
- ``PUT /listings/{id}/`` - Update listing (admin only)
- ``DELETE /listings/{id}/`` - Delete listing (admin only)
- ``GET /listings/search/`` - Search listings

#### Realtors
- ``GET /realtors/`` - Get all realtors
- ``GET /realtors/{id}/`` - Get realtor details

#### Contacts
- ``POST /contacts/`` - Submit contact form

## Response Format
All API responses follow this format:

``json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "errors": null
}
``
"@ | Out-File -FilePath "API.md" -Encoding UTF8
}

# Create DEVELOPMENT.md if it doesn't exist
if (-not (Test-Path "DEVELOPMENT.md")) {
    @"
# Development Guide

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Setup
1. Clone the repository
2. Run the setup script: ``.\scripts\setup.ps1``
3. Start the backend: ``cd backend && venv\Scripts\Activate && python manage.py runserver``
4. Start the frontend: ``cd frontend && npm run dev``

### Development Workflow
1. Create a feature branch
2. Implement backend changes first
3. Write tests for backend
4. Implement frontend changes
5. Write tests for frontend
6. Run all tests
7. Submit pull request

### Code Standards
- Backend: Follow PEP 8 and Django best practices
- Frontend: Follow ESLint and Prettier configurations
- Use TypeScript for all new frontend code
- Write tests for all new features

### Testing
- Backend: ``pytest``
- Frontend: ``npm test``
- E2E: ``npx playwright test``
"@ | Out-File -FilePath "DEVELOPMENT.md" -Encoding UTF8
}

Write-Host "✅ Documentation setup completed" -ForegroundColor Green

# Setup Git configuration
Write-Host ""
Write-Host "🔗 Setting up Git configuration..." -ForegroundColor Yellow
Set-Location ..

# Create .gitignore for root
@"
# Environment files
.env
.env.local
.env.*.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log

# Temporary files
*.tmp
*.temp

# Coverage reports
htmlcov/
.coverage
coverage.xml

# Cache directories
__pycache__/
.cache/
.pytest_cache/

# Build directories
build/
dist/
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8

Write-Host "✅ Git configuration completed" -ForegroundColor Green

# Create start scripts
Write-Host ""
Write-Host "📝 Creating start scripts..." -ForegroundColor Yellow

# Create start-backend.ps1
@"
# Start Backend Server
Write-Host "🔧 Starting Django Backend Server..." -ForegroundColor Yellow
Set-Location backend
& "venv\Scripts\Activate.ps1"
python manage.py migrate
python manage.py runserver
"@ | Out-File -FilePath "scripts\start-backend.ps1" -Encoding UTF8

# Create start-frontend.ps1
@"
# Start Frontend Server
Write-Host "🎨 Starting Next.js Frontend Server..." -ForegroundColor Yellow
Set-Location frontend
npm run dev
"@ | Out-File -FilePath "scripts\start-frontend.ps1" -Encoding UTF8

# Create start-dev.ps1
@"
# Start Development Environment
Write-Host "🚀 Starting Full Development Environment..." -ForegroundColor Green

# Start backend in background
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$PWD'; .\scripts\start-backend.ps1"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend in background
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$PWD'; .\scripts\start-frontend.ps1"

Write-Host "✅ Development servers started!" -ForegroundColor Green
Write-Host "Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C in each terminal to stop the servers" -ForegroundColor Yellow
"@ | Out-File -FilePath "scripts\start-dev.ps1" -Encoding UTF8

# Final instructions
Write-Host ""
Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. 📝 Update .env files with your configuration" -ForegroundColor White
Write-Host "2. 🏃‍♂️ Start development servers: .\scripts\start-dev.ps1" -ForegroundColor White
Write-Host "3. 🌐 Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "Quick start commands:" -ForegroundColor Cyan
Write-Host "- Backend only: .\scripts\start-backend.ps1" -ForegroundColor White
Write-Host "- Frontend only: .\scripts\start-frontend.ps1" -ForegroundColor White
Write-Host "- Both servers: .\scripts\start-dev.ps1" -ForegroundColor White
Write-Host ""
Write-Host "For more information, check the documentation in the docs\ directory." -ForegroundColor Yellow
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Green
