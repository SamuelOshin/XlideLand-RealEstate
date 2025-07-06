# Migration Plan - Django Monolith to Full Stack

## Overview
This document outlines the step-by-step migration process from the current Django monolithic application to a modern full-stack architecture with Next.js frontend and Django REST API backend.

## Current State Analysis
- **Framework**: Django with template-based frontend
- **Database**: SQLite (development) with models for Listings, Realtors, Contacts, Accounts
- **Frontend**: Bootstrap 5, custom CSS, jQuery
- **Features**: Property listings, user authentication, contact forms, admin panel

## Migration Strategy: Strangler Fig Pattern
We'll use the Strangler Fig pattern to gradually replace the monolithic application while keeping it functional throughout the migration.

## Phase 1: Repository Restructuring (Days 1-2)

### Day 1: Setup New Structure
1. **Create Directory Structure**
   ```bash
   mkdir backend frontend docs scripts
   ```

2. **Move Existing Code to Backend**
   ```bash
   # Move Django files to backend/
   mv accounts/ backend/
   mv listings/ backend/
   mv realtors/ backend/
   mv contacts/ backend/
   mv pages/ backend/
   mv btre/ backend/core/
   mv manage.py backend/
   mv requirements.txt backend/requirements/base.txt
   mv db.sqlite3 backend/
   mv media/ backend/
   ```

3. **Initialize Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - restructure project"
   ```

### Day 2: Backend Foundation Setup
1. **Install Django REST Framework**
   ```bash
   cd backend
   pip install djangorestframework djangorestframework-simplejwt django-cors-headers
   pip freeze > requirements/base.txt
   ```

2. **Update Settings Structure**
   - Create `core/settings/` directory
   - Split settings into `base.py`, `development.py`, `production.py`
   - Add DRF and CORS configuration

3. **Create API App**
   ```bash
   python manage.py startapp api
   ```

## Phase 2: Backend API Development (Days 3-7)

### Day 3: Authentication API
1. **Install and Configure JWT**
   ```python
   # settings/base.py
   INSTALLED_APPS += [
       'rest_framework',
       'rest_framework_simplejwt',
       'corsheaders',
   ]
   
   REST_FRAMEWORK = {
       'DEFAULT_AUTHENTICATION_CLASSES': [
           'rest_framework_simplejwt.authentication.JWTAuthentication',
       ],
       'DEFAULT_PERMISSION_CLASSES': [
           'rest_framework.permissions.IsAuthenticated',
       ],
   }
   ```

2. **Create User Serializers and Views**
   ```python
   # accounts/serializers.py
   from rest_framework import serializers
   from django.contrib.auth.models import User
   
   class UserRegistrationSerializer(serializers.ModelSerializer):
       password = serializers.CharField(write_only=True)
       
       class Meta:
           model = User
           fields = ('username', 'email', 'password', 'first_name', 'last_name')
   ```

3. **Implement Authentication Endpoints**
   - `/api/auth/register/`
   - `/api/auth/login/`
   - `/api/auth/refresh/`
   - `/api/auth/logout/`

### Day 4: Listings API
1. **Create Listing Serializers**
   ```python
   # listings/serializers.py
   from rest_framework import serializers
   from .models import Listing
   
   class ListingSerializer(serializers.ModelSerializer):
       class Meta:
           model = Listing
           fields = '__all__'
   ```

2. **Implement Repository Pattern**
   ```python
   # listings/repositories.py
   from common.repositories import BaseRepository
   from .models import Listing
   
   class ListingRepository(BaseRepository):
       model = Listing
       
       def search_properties(self, query, filters):
           queryset = self.model.objects.filter(is_published=True)
           # Add search logic
           return queryset
   ```

3. **Create Listing Services**
   ```python
   # listings/services.py
   from common.services import BaseService
   from .repositories import ListingRepository
   
   class ListingService(BaseService):
       def __init__(self):
           self.repository = ListingRepository()
   ```

4. **Implement Listing Endpoints**
   - `GET /api/listings/` - List all properties
   - `POST /api/listings/` - Create property (admin only)
   - `GET /api/listings/{id}/` - Get property details
   - `PUT /api/listings/{id}/` - Update property (admin only)
   - `DELETE /api/listings/{id}/` - Delete property (admin only)
   - `GET /api/listings/search/` - Search properties

### Day 5: Realtors and Contacts API
1. **Create Realtor API**
   ```python
   # realtors/views.py
   from rest_framework import viewsets
   from .models import Realtor
   from .serializers import RealtorSerializer
   
   class RealtorViewSet(viewsets.ReadOnlyModelViewSet):
       queryset = Realtor.objects.all()
       serializer_class = RealtorSerializer
   ```

2. **Create Contact API**
   ```python
   # contacts/views.py
   from rest_framework import status
   from rest_framework.decorators import api_view
   from rest_framework.response import Response
   from .serializers import ContactSerializer
   
   @api_view(['POST'])
   def create_contact(request):
       serializer = ContactSerializer(data=request.data)
       if serializer.is_valid():
           serializer.save()
           return Response(serializer.data, status=status.HTTP_201_CREATED)
       return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   ```

### Day 6: File Upload and Media Handling
1. **Configure Media Settings**
   ```python
   # settings/base.py
   MEDIA_URL = '/media/'
   MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
   ```

2. **Implement File Upload API**
   ```python
   # api/views.py
   from rest_framework.decorators import api_view, parser_classes
   from rest_framework.parsers import MultiPartParser, FormParser
   
   @api_view(['POST'])
   @parser_classes([MultiPartParser, FormParser])
   def upload_image(request):
       # Handle image upload
       pass
   ```

### Day 7: API Documentation and Testing
1. **Install and Configure Swagger**
   ```bash
   pip install drf-spectacular
   ```

2. **Add API Documentation**
   ```python
   # settings/base.py
   INSTALLED_APPS += ['drf_spectacular']
   
   REST_FRAMEWORK['DEFAULT_SCHEMA_CLASS'] = 'drf_spectacular.openapi.AutoSchema'
   ```

3. **Write API Tests**
   ```python
   # tests/test_listings.py
   from rest_framework.test import APITestCase
   from django.contrib.auth.models import User
   from listings.models import Listing
   
   class ListingAPITest(APITestCase):
       def setUp(self):
           self.user = User.objects.create_user('testuser', 'test@test.com', 'pass')
       
       def test_get_listings(self):
           response = self.client.get('/api/listings/')
           self.assertEqual(response.status_code, 200)
   ```

## Phase 3: Frontend Development (Days 8-14)

### Day 8: Next.js Setup
1. **Initialize Next.js Project**
   ```bash
   cd frontend
   npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
   ```

2. **Install Dependencies**
   ```bash
   npm install @radix-ui/react-* class-variance-authority clsx tailwind-merge lucide-react
   npm install axios react-query @tanstack/react-query zustand
   npm install react-hook-form @hookform/resolvers zod
   ```

3. **Configure Tailwind and Shadcn UI**
   ```bash
   npx shadcn-ui@latest init
   npx shadcn-ui@latest add button input card dialog select
   ```

### Day 9: Layout and Navigation
1. **Create Layout Components**
   ```typescript
   // src/components/layout/Header.tsx
   export default function Header() {
     // Modern header with Tailwind CSS
   }
   ```

2. **Implement Navigation**
   ```typescript
   // src/components/layout/Navigation.tsx
   export default function Navigation() {
     // Responsive navigation with mobile menu
   }
   ```

3. **Setup Root Layout**
   ```typescript
   // src/app/layout.tsx
   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode
   }) {
     return (
       <html lang="en">
         <body className={inter.className}>
           <Header />
           <main>{children}</main>
           <Footer />
         </body>
       </html>
     )
   }
   ```

### Day 10: API Integration Setup
1. **Create API Service Layer**
   ```typescript
   // src/services/api.ts
   import axios from 'axios'
   
   const api = axios.create({
     baseURL: process.env.NEXT_PUBLIC_API_URL,
   })
   
   export default api
   ```

2. **Implement Authentication Service**
   ```typescript
   // src/services/authService.ts
   import api from './api'
   
   export class AuthService {
     async login(credentials: LoginCredentials) {
       const response = await api.post('/auth/login/', credentials)
       return response.data
     }
   }
   ```

3. **Setup State Management**
   ```typescript
   // src/store/authStore.ts
   import { create } from 'zustand'
   
   interface AuthState {
     user: User | null
     token: string | null
     login: (credentials: LoginCredentials) => Promise<void>
     logout: () => void
   }
   
   export const useAuthStore = create<AuthState>((set) => ({
     // Implementation
   }))
   ```

### Day 11: Property Components
1. **Create Property Card Component**
   ```typescript
   // src/components/property/PropertyCard.tsx
   interface PropertyCardProps {
     property: Property
   }
   
   export default function PropertyCard({ property }: PropertyCardProps) {
     // Modern property card with Tailwind CSS
   }
   ```

2. **Implement Property Grid**
   ```typescript
   // src/components/property/PropertyGrid.tsx
   export default function PropertyGrid({ properties }: { properties: Property[] }) {
     // Responsive grid layout
   }
   ```

3. **Create Property Detail Component**
   ```typescript
   // src/components/property/PropertyDetail.tsx
   export default function PropertyDetail({ property }: { property: Property }) {
     // Detailed property view with image gallery
   }
   ```

### Day 12: Pages Implementation
1. **Home Page**
   ```typescript
   // src/app/page.tsx
   export default function HomePage() {
     return (
       <>
         <HeroSection />
         <FeaturedProperties />
         <AboutSection />
       </>
     )
   }
   ```

2. **Listings Page**
   ```typescript
   // src/app/listings/page.tsx
   export default function ListingsPage() {
     // Property listings with search and filters
   }
   ```

3. **Property Detail Page**
   ```typescript
   // src/app/listings/[id]/page.tsx
   export default function PropertyDetailPage({ params }: { params: { id: string } }) {
     // Individual property details
   }
   ```

### Day 13: Authentication Pages
1. **Login Page**
   ```typescript
   // src/app/(auth)/login/page.tsx
   export default function LoginPage() {
     // Login form with validation
   }
   ```

2. **Register Page**
   ```typescript
   // src/app/(auth)/register/page.tsx
   export default function RegisterPage() {
     // Registration form with validation
   }
   ```

3. **Dashboard Page**
   ```typescript
   // src/app/dashboard/page.tsx
   export default function DashboardPage() {
     // User dashboard with favorites
   }
   ```

### Day 14: Forms and Interactions
1. **Search Form**
   ```typescript
   // src/components/forms/SearchForm.tsx
   export default function SearchForm() {
     // Advanced property search
   }
   ```

2. **Contact Form**
   ```typescript
   // src/components/forms/ContactForm.tsx
   export default function ContactForm() {
     // Contact form with validation
   }
   ```

## Phase 4: Integration and Testing (Days 15-17)

### Day 15: API Integration
1. **Connect Frontend to Backend APIs**
2. **Implement Error Handling**
3. **Add Loading States**
4. **Setup React Query for Data Fetching**

### Day 16: Testing
1. **Backend Tests**
   - Unit tests for models
   - API endpoint tests
   - Integration tests

2. **Frontend Tests**
   - Component unit tests
   - Hook tests
   - Integration tests

### Day 17: End-to-End Testing
1. **Setup Playwright**
2. **Write E2E Tests**
3. **Performance Testing**

## Phase 5: Deployment (Days 18-21)

### Day 18: Docker Setup
1. **Backend Dockerfile**
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements/production.txt .
   RUN pip install -r production.txt
   COPY . .
   CMD ["gunicorn", "core.wsgi:application"]
   ```

2. **Frontend Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   CMD ["npm", "start"]
   ```

3. **Docker Compose**
   ```yaml
   version: '3.8'
   services:
     backend:
       build: ./backend
       ports:
         - "8000:8000"
     frontend:
       build: ./frontend
       ports:
         - "3000:3000"
     db:
       image: postgres:15
   ```

### Day 19: Environment Configuration
1. **Environment Variables**
2. **Database Migration**
3. **Static Files Configuration**

### Day 20: CI/CD Pipeline
1. **GitHub Actions Setup**
2. **Automated Testing**
3. **Deployment Pipeline**

### Day 21: Production Deployment
1. **Deploy to Cloud Platform**
2. **DNS Configuration**
3. **SSL Certificate**
4. **Monitoring Setup**

## Data Migration Strategy

### 1. Export Current Data
```python
# scripts/export_data.py
import json
from django.core import serializers
from listings.models import Listing
from realtors.models import Realtor

def export_data():
    listings = serializers.serialize('json', Listing.objects.all())
    realtors = serializers.serialize('json', Realtor.objects.all())
    
    with open('data_export.json', 'w') as f:
        json.dump({
            'listings': listings,
            'realtors': realtors
        }, f)
```

### 2. Import to New Structure
```python
# scripts/import_data.py
def import_data():
    with open('data_export.json', 'r') as f:
        data = json.load(f)
    
    # Import data to new models
```

## Testing Strategy

### Backend Testing
```python
# pytest configuration
# conftest.py
import pytest
from django.test import Client
from django.contrib.auth.models import User

@pytest.fixture
def api_client():
    return Client()

@pytest.fixture
def user():
    return User.objects.create_user('testuser', 'test@test.com', 'pass')
```

### Frontend Testing
```typescript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}
```

## Success Criteria
- [ ] All existing functionality preserved
- [ ] Modern, responsive UI
- [ ] API documentation complete
- [ ] Test coverage > 80%
- [ ] Performance improvements
- [ ] SEO optimization
- [ ] Accessibility compliance
- [ ] Security best practices implemented

## Rollback Plan
1. Keep old Django app running on subdomain
2. Database backup before migration
3. Feature flags for gradual rollout
4. Quick switch mechanism if issues arise

This migration plan ensures a smooth transition while maintaining functionality and improving the overall architecture and user experience.
