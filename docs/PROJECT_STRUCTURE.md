# Project Structure Guide

## Directory Overview

```
XlideLand/
├── backend/                          # Django REST API Backend
│   ├── api/                         # Main API app
│   │   ├── __init__.py
│   │   ├── urls.py                  # API URL routing
│   │   ├── views.py                 # API views
│   │   └── middleware.py            # Custom middleware
│   ├── core/                        # Core application settings
│   │   ├── __init__.py
│   │   ├── settings/                # Environment-specific settings
│   │   │   ├── __init__.py
│   │   │   ├── base.py             # Base settings
│   │   │   ├── development.py      # Development settings
│   │   │   ├── production.py       # Production settings
│   │   │   └── testing.py          # Testing settings
│   │   ├── urls.py                 # Main URL configuration
│   │   ├── wsgi.py                 # WSGI configuration
│   │   └── asgi.py                 # ASGI configuration
│   ├── accounts/                    # User management
│   │   ├── models.py               # User models
│   │   ├── serializers.py          # DRF serializers
│   │   ├── views.py                # API views
│   │   ├── urls.py                 # Account URLs
│   │   ├── services.py             # Business logic
│   │   └── repositories.py         # Data access layer
│   ├── listings/                    # Property listings
│   │   ├── models.py               # Listing models
│   │   ├── serializers.py          # DRF serializers
│   │   ├── views.py                # API views
│   │   ├── urls.py                 # Listing URLs
│   │   ├── services.py             # Business logic
│   │   ├── repositories.py         # Data access layer
│   │   └── filters.py              # Search filters
│   ├── realtors/                    # Realtor management
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── services.py
│   │   └── repositories.py
│   ├── contacts/                    # Contact management
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── services.py
│   │   └── repositories.py
│   ├── common/                      # Shared utilities
│   │   ├── __init__.py
│   │   ├── models.py               # Base models
│   │   ├── serializers.py          # Base serializers
│   │   ├── views.py                # Base views
│   │   ├── permissions.py          # Custom permissions
│   │   ├── pagination.py           # Custom pagination
│   │   ├── exceptions.py           # Custom exceptions
│   │   └── utils.py                # Utility functions
│   ├── media/                       # Media files
│   │   └── photos/
│   ├── static/                      # Static files (for admin)
│   ├── tests/                       # Test files
│   │   ├── __init__.py
│   │   ├── test_accounts.py
│   │   ├── test_listings.py
│   │   ├── test_realtors.py
│   │   └── test_contacts.py
│   ├── requirements/                # Dependencies
│   │   ├── base.txt                # Base requirements
│   │   ├── development.txt         # Development requirements
│   │   ├── production.txt          # Production requirements
│   │   └── testing.txt             # Testing requirements
│   ├── manage.py                    # Django management script
│   ├── .env.example                # Environment variables template
│   ├── .gitignore                  # Git ignore rules
│   └── Dockerfile                  # Docker configuration
├── frontend/                        # Next.js React Frontend
│   ├── src/                        # Source code
│   │   ├── app/                    # Next.js 14 App Router
│   │   │   ├── layout.tsx          # Root layout
│   │   │   ├── page.tsx            # Home page
│   │   │   ├── globals.css         # Global styles
│   │   │   ├── loading.tsx         # Loading UI
│   │   │   ├── error.tsx           # Error UI
│   │   │   ├── not-found.tsx       # 404 page
│   │   │   ├── (auth)/             # Auth group
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── listings/           # Listings pages
│   │   │   │   ├── page.tsx        # Listings list
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx    # Listing detail
│   │   │   │   └── layout.tsx
│   │   │   ├── dashboard/          # User dashboard
│   │   │   │   ├── page.tsx
│   │   │   │   ├── favorites/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── profile/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   └── api/                # API routes (if needed)
│   │   ├── components/             # React components
│   │   │   ├── ui/                 # Shadcn UI components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   └── ...
│   │   │   ├── layout/             # Layout components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Navigation.tsx
│   │   │   ├── property/           # Property-related components
│   │   │   │   ├── PropertyCard.tsx
│   │   │   │   ├── PropertyGrid.tsx
│   │   │   │   ├── PropertyDetail.tsx
│   │   │   │   ├── PropertySearch.tsx
│   │   │   │   └── PropertyGallery.tsx
│   │   │   ├── forms/              # Form components
│   │   │   │   ├── ContactForm.tsx
│   │   │   │   ├── SearchForm.tsx
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   └── common/             # Common components
│   │   │       ├── Loading.tsx
│   │   │       ├── ErrorBoundary.tsx
│   │   │       ├── SEO.tsx
│   │   │       └── ImageWithFallback.tsx
│   │   ├── lib/                    # Utilities and configuration
│   │   │   ├── utils.ts            # Utility functions
│   │   │   ├── api.ts              # API configuration
│   │   │   ├── auth.ts             # Authentication utilities
│   │   │   ├── constants.ts        # Application constants
│   │   │   ├── validations.ts      # Form validations (Zod schemas)
│   │   │   └── providers.tsx       # Context providers
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── useAuth.ts          # Authentication hook
│   │   │   ├── useListings.ts      # Listings data hook
│   │   │   ├── useLocalStorage.ts  # Local storage hook
│   │   │   └── useDebounce.ts      # Debounce hook
│   │   ├── services/               # API service layer
│   │   │   ├── api.ts              # Base API service
│   │   │   ├── authService.ts      # Authentication API
│   │   │   ├── listingService.ts   # Listing API
│   │   │   ├── realtorService.ts   # Realtor API
│   │   │   └── contactService.ts   # Contact API
│   │   ├── types/                  # TypeScript type definitions
│   │   │   ├── api.ts              # API response types
│   │   │   ├── listing.ts          # Listing types
│   │   │   ├── user.ts             # User types
│   │   │   ├── realtor.ts          # Realtor types
│   │   │   └── common.ts           # Common types
│   │   ├── store/                  # State management (Zustand)
│   │   │   ├── authStore.ts        # Authentication state
│   │   │   ├── listingStore.ts     # Listing state
│   │   │   └── uiStore.ts          # UI state
│   │   └── styles/                 # Styling
│   │       ├── globals.css         # Global CSS
│   │       └── components.css      # Component-specific CSS
│   ├── public/                     # Static assets
│   │   ├── images/                 # Static images
│   │   ├── icons/                  # Icons and favicons
│   │   └── favicon.ico
│   ├── docs/                       # Frontend documentation
│   ├── tests/                      # Test files
│   │   ├── __mocks__/             # Mock files
│   │   ├── components/            # Component tests
│   │   ├── hooks/                 # Hook tests
│   │   ├── services/              # Service tests
│   │   └── utils/                 # Utility tests
│   ├── .env.local.example         # Environment variables template
│   ├── .gitignore                 # Git ignore rules
│   ├── next.config.js             # Next.js configuration
│   ├── tailwind.config.js         # Tailwind CSS configuration
│   ├── postcss.config.js          # PostCSS configuration
│   ├── tsconfig.json              # TypeScript configuration
│   ├── package.json               # Dependencies and scripts
│   └── Dockerfile                 # Docker configuration
├── docs/                           # Project documentation
│   ├── API.md                     # API documentation
│   ├── DEPLOYMENT.md              # Deployment guide
│   ├── DEVELOPMENT.md             # Development setup
│   ├── TESTING.md                 # Testing guide
│   └── TROUBLESHOOTING.md         # Common issues
├── scripts/                        # Utility scripts
│   ├── setup.sh                   # Initial setup script
│   ├── migrate.py                 # Data migration script
│   ├── seed.py                    # Database seeding
│   └── deploy.sh                  # Deployment script
├── docker-compose.yml             # Multi-service Docker setup
├── docker-compose.prod.yml        # Production Docker setup
├── .gitignore                     # Root Git ignore
├── README.md                      # Project README
└── IMPLEMENTATION_GUIDE.md        # This guide
```

## File Naming Conventions

### Backend (Python/Django)
- **Files**: snake_case (e.g., `user_service.py`)
- **Classes**: PascalCase (e.g., `UserService`)
- **Functions/Variables**: snake_case (e.g., `get_user_data`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)

### Frontend (TypeScript/React)
- **Files**: PascalCase for components (e.g., `UserCard.tsx`)
- **Files**: camelCase for utilities (e.g., `apiHelpers.ts`)
- **Components**: PascalCase (e.g., `PropertyCard`)
- **Functions/Variables**: camelCase (e.g., `getUserData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

## Architecture Patterns

### Backend Repository Pattern
```python
# repositories/base_repository.py
from abc import ABC, abstractmethod
from typing import List, Optional, Any
from django.db import models

class BaseRepository(ABC):
    model: models.Model = None
    
    def get_all(self, **filters) -> List[models.Model]:
        return self.model.objects.filter(**filters)
    
    def get_by_id(self, id: int) -> Optional[models.Model]:
        try:
            return self.model.objects.get(id=id)
        except self.model.DoesNotExist:
            return None
    
    def create(self, data: dict) -> models.Model:
        return self.model.objects.create(**data)
    
    def update(self, id: int, data: dict) -> Optional[models.Model]:
        instance = self.get_by_id(id)
        if instance:
            for key, value in data.items():
                setattr(instance, key, value)
            instance.save()
        return instance
    
    def delete(self, id: int) -> bool:
        instance = self.get_by_id(id)
        if instance:
            instance.delete()
            return True
        return False
```

### Backend Service Pattern
```python
# services/base_service.py
from typing import Any, Dict, List, Optional
from repositories.base_repository import BaseRepository

class BaseService:
    def __init__(self, repository: BaseRepository):
        self.repository = repository
    
    def get_all(self, **filters) -> List[Any]:
        return self.repository.get_all(**filters)
    
    def get_by_id(self, id: int) -> Optional[Any]:
        return self.repository.get_by_id(id)
    
    def create(self, data: Dict[str, Any]) -> Any:
        validated_data = self.validate_create_data(data)
        return self.repository.create(validated_data)
    
    def update(self, id: int, data: Dict[str, Any]) -> Optional[Any]:
        validated_data = self.validate_update_data(data)
        return self.repository.update(id, validated_data)
    
    def delete(self, id: int) -> bool:
        return self.repository.delete(id)
    
    def validate_create_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        # Override in child classes
        return data
    
    def validate_update_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        # Override in child classes
        return data
```

### Frontend Service Pattern
```typescript
// services/BaseApiService.ts
export class BaseApiService {
  protected baseURL: string
  protected headers: Record<string, string>
  
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    this.headers = {
      'Content-Type': 'application/json',
    }
  }
  
  protected async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: this.headers,
      ...options,
    }
    
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return response.json()
  }
  
  protected async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }
  
  protected async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
  
  protected async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }
  
  protected async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}
```

## Development Workflow

1. **Feature Development**:
   - Create feature branch
   - Implement backend API first
   - Write tests for backend
   - Implement frontend components
   - Write tests for frontend
   - Integration testing
   - Code review
   - Merge to main

2. **Code Quality**:
   - Pre-commit hooks
   - Linting (ESLint, Flake8)
   - Type checking (TypeScript, mypy)
   - Automated testing
   - Code coverage reports

3. **Documentation**:
   - API documentation (Swagger)
   - Component documentation (Storybook)
   - README files
   - Inline code comments

This structure provides a solid foundation for a scalable, maintainable full-stack application following industry best practices.
