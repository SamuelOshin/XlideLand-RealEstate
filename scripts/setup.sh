#!/bin/bash

# XlideLand Project Setup Script
# This script sets up the development environment for the full-stack real estate application

set -e  # Exit on any error

echo "🏠 XlideLand Real Estate - Development Setup"
echo "============================================"

# Check if we're in the right directory
if [ ! -f "IMPLEMENTATION_GUIDE.md" ]; then
    echo "❌ Error: Please run this script from the XlideLand root directory"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists python3; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

if ! command_exists node; then
    echo "❌ Node.js is required but not installed"
    exit 1
fi

if ! command_exists git; then
    echo "❌ Git is required but not installed"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Setup Backend
echo ""
echo "🔧 Setting up Backend (Django REST API)..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Create requirements directory structure
mkdir -p requirements

# Create base requirements file
cat > requirements/base.txt << EOF
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
EOF

# Create development requirements
cat > requirements/development.txt << EOF
-r base.txt
pytest>=7.4.0
pytest-django>=4.5.0
pytest-cov>=4.1.0
black>=23.7.0
flake8>=6.0.0
mypy>=1.5.0
django-debug-toolbar>=4.2.0
factory-boy>=3.3.0
EOF

# Create production requirements
cat > requirements/production.txt << EOF
-r base.txt
gunicorn>=21.2.0
whitenoise>=6.5.0
sentry-sdk>=1.32.0
django-storages>=1.13.0
boto3>=1.28.0
EOF

# Install requirements
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements/development.txt

# Create .env.example file
cat > .env.example << EOF
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
EOF

# Copy .env.example to .env
cp .env.example .env

echo "✅ Backend setup completed"

# Setup Frontend
echo ""
echo "🎨 Setting up Frontend (Next.js)..."
cd ../frontend

# Check if package.json exists, if not create the Next.js project
if [ ! -f "package.json" ]; then
    echo "📦 Creating Next.js project..."
    npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
fi

# Install additional dependencies
echo "📦 Installing additional dependencies..."
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-toast
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install axios @tanstack/react-query zustand
npm install react-hook-form @hookform/resolvers zod
npm install framer-motion swiper
npm install next-auth

# Install development dependencies
npm install --save-dev @types/node @types/react @types/react-dom
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev eslint-config-prettier prettier
npm install --save-dev @playwright/test

# Create .env.local.example
cat > .env.local.example << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_MEDIA_URL=http://localhost:8000/media

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# External Services
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_ANALYTICS_ID=
EOF

# Copy .env.local.example to .env.local
cp .env.local.example .env.local

# Initialize Shadcn UI
echo "🎨 Setting up Shadcn UI..."
npx shadcn-ui@latest init --yes --defaults

# Add essential Shadcn UI components
npx shadcn-ui@latest add button input card dialog select sheet navigation-menu badge

echo "✅ Frontend setup completed"

# Setup Documentation
echo ""
echo "📚 Setting up Documentation..."
cd ../docs

# Create essential documentation files
if [ ! -f "API.md" ]; then
    cat > API.md << EOF
# API Documentation

## Overview
This document describes the REST API endpoints for the XlideLand Real Estate application.

## Base URL
- Development: \`http://localhost:8000/api\`
- Production: \`https://api.xlideland.com\`

## Authentication
The API uses JWT (JSON Web Tokens) for authentication.

### Endpoints

#### Authentication
- \`POST /auth/register/\` - User registration
- \`POST /auth/login/\` - User login
- \`POST /auth/refresh/\` - Refresh JWT token
- \`POST /auth/logout/\` - User logout

#### Listings
- \`GET /listings/\` - Get all listings
- \`POST /listings/\` - Create a new listing (admin only)
- \`GET /listings/{id}/\` - Get listing details
- \`PUT /listings/{id}/\` - Update listing (admin only)
- \`DELETE /listings/{id}/\` - Delete listing (admin only)
- \`GET /listings/search/\` - Search listings

#### Realtors
- \`GET /realtors/\` - Get all realtors
- \`GET /realtors/{id}/\` - Get realtor details

#### Contacts
- \`POST /contacts/\` - Submit contact form

## Response Format
All API responses follow this format:

\`\`\`json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "errors": null
}
\`\`\`
EOF
fi

if [ ! -f "DEVELOPMENT.md" ]; then
    cat > DEVELOPMENT.md << EOF
# Development Guide

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Setup
1. Clone the repository
2. Run the setup script: \`./scripts/setup.sh\`
3. Start the backend: \`cd backend && python manage.py runserver\`
4. Start the frontend: \`cd frontend && npm run dev\`

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
- Backend: \`pytest\`
- Frontend: \`npm test\`
- E2E: \`npx playwright test\`
EOF
fi

echo "✅ Documentation setup completed"

# Setup Git hooks
echo ""
echo "🔗 Setting up Git hooks..."
cd ..

# Create pre-commit hook
mkdir -p .git/hooks
cat > .git/hooks/pre-commit << EOF
#!/bin/bash
# Pre-commit hook for XlideLand

echo "Running pre-commit checks..."

# Check backend code
cd backend
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    echo "Running backend linting..."
    flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
    if [ $? -ne 0 ]; then
        echo "❌ Backend linting failed"
        exit 1
    fi
fi
cd ..

# Check frontend code
cd frontend
if [ -f "package.json" ]; then
    echo "Running frontend linting..."
    npm run lint
    if [ $? -ne 0 ]; then
        echo "❌ Frontend linting failed"
        exit 1
    fi
fi
cd ..

echo "✅ Pre-commit checks passed"
EOF

chmod +x .git/hooks/pre-commit

# Create .gitignore for root
cat > .gitignore << EOF
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
EOF

echo "✅ Git hooks setup completed"

# Final instructions
echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. 📝 Update .env files with your configuration"
echo "2. 🏃‍♂️ Start the backend: cd backend && source venv/bin/activate && python manage.py runserver"
echo "3. 🎨 Start the frontend: cd frontend && npm run dev"
echo "4. 🌐 Open http://localhost:3000 in your browser"
echo ""
echo "For more information, check the documentation in the docs/ directory."
echo ""
echo "Happy coding! 🚀"
EOF
