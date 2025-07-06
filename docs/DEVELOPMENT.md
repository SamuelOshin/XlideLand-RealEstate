# Development Guide

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Setup
1. Clone the repository
2. Run the setup script: `.\scripts\setup.ps1`
3. Start the backend: `cd backend && venv\Scripts\Activate && python manage.py runserver`
4. Start the frontend: `cd frontend && npm run dev`

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
- Backend: `pytest`
- Frontend: `npm test`
- E2E: `npx playwright test`
