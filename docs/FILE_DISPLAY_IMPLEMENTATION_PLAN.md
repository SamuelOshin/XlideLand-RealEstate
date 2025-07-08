# 🖼️ File Display Implementation Plan - Rendering Uploaded Files

## Overview
Now that file uploads are working successfully, we need to implement the display/rendering of uploaded files throughout the frontend. This includes:
- **Avatar display** in profile pages and sidebar dropdowns
- **Property images** in property listings, cards, and detail pages
- **Document thumbnails** in document management sections

## Current State Analysis

### ✅ What's Working
- File uploads to Vercel Blob storage ✅
- File metadata storage in Django `FileUpload` model ✅
- Upload API routes with proper authentication ✅
- Toast notifications for upload feedback ✅

### 🔄 What Needs Implementation
- File retrieval API endpoints
- Avatar display components
- Property image rendering
- Profile picture integration
- Sidebar avatar display
- Property listing image galleries

## 🏗️ Implementation Strategy

### Phase 1: Backend API Endpoints for File Retrieval

#### 1.1 User Avatar Endpoint
```python
# Django endpoint: /api/accounts/profile/avatar/
- GET: Return user's current avatar URL
- Response: { "avatar_url": "https://...", "has_avatar": true }
```

#### 1.2 User Files Endpoint  
```python
# Django endpoint: /api/accounts/files/
- GET: Return all user's uploaded files
- Query params: ?file_type=avatar&file_type=document
- Response: { "files": [...], "count": 10 }
```

#### 1.3 Property Images Endpoint
```python
# Django endpoint: /api/listings/{id}/images/
- GET: Return all images for a specific property
- Response: { "images": [...], "main_image": "..." }
```

### Phase 2: Frontend API Integration

#### 2.1 Create File Retrieval Hooks
```typescript
// hooks/useUserFiles.ts
- useUserAvatar() - Get current user avatar
- useUserFiles(type) - Get user files by type
- usePropertyImages(propertyId) - Get property images
```

#### 2.2 Update Authentication Context
```typescript
// contexts/AuthContext.tsx
- Add avatar_url to user object
- Refresh avatar when updated
- Handle avatar loading states
```

### Phase 3: Component Updates

#### 3.1 Avatar Display Components
```typescript
// components/ui/Avatar.tsx - Reusable avatar component
// components/ui/UserAvatar.tsx - User-specific avatar with fallback
```

#### 3.2 Update Existing Components
- Header dropdown avatar
- Sidebar user section
- Profile page avatar
- Settings page avatar
- Admin user list avatars

#### 3.3 Property Image Components
```typescript
// components/ui/PropertyImageGallery.tsx
// components/ui/PropertyCard.tsx - Updated with real images
```

## 📋 Detailed Implementation Steps

### Step 1: Django Backend Endpoints

#### Create Avatar Retrieval View
**File: `backend/accounts/views.py`**
```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_avatar(request):
    try:
        # Get user's avatar from FileUpload model
        avatar_file = FileUpload.objects.filter(
            user=request.user,
            file_type='avatar',
            upload_status='completed'
        ).order_by('-uploaded_at').first()
        
        if avatar_file:
            return Response({
                'avatar_url': avatar_file.blob_url,
                'has_avatar': True,
                'uploaded_at': avatar_file.uploaded_at
            })
        else:
            return Response({
                'avatar_url': None,
                'has_avatar': False
            })
    except Exception as e:
        return Response({'error': str(e)}, status=500)
```

#### Create User Files Retrieval View
```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_files(request):
    file_type = request.GET.get('file_type')
    queryset = FileUpload.objects.filter(
        user=request.user,
        upload_status='completed'
    )
    
    if file_type:
        queryset = queryset.filter(file_type=file_type)
    
    files = FileUploadSerializer(queryset, many=True).data
    return Response({'files': files, 'count': len(files)})
```

#### Add URLs
**File: `backend/accounts/urls.py`**
```python
path('profile/avatar/', views.get_user_avatar, name='user-avatar'),
path('files/', views.get_user_files, name='user-files'),
```

### Step 2: Frontend File Retrieval Hooks

#### Create User Avatar Hook
**File: `frontend/src/hooks/useUserAvatar.ts`**
```typescript
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AvatarData {
  avatar_url: string | null;
  has_avatar: boolean;
  uploaded_at?: string;
}

export function useUserAvatar() {
  const [avatar, setAvatar] = useState<AvatarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAvatar = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/user/avatar', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch avatar');
      }

      const data = await response.json();
      setAvatar(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, [user]);

  return { avatar, loading, error, refetch: fetchAvatar };
}
```

#### Create Property Images Hook
**File: `frontend/src/hooks/usePropertyImages.ts`**
```typescript
export function usePropertyImages(propertyId: string) {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/properties/${propertyId}/images`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch property images');
      }

      const data = await response.json();
      setImages(data.images || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchImages();
    }
  }, [propertyId]);

  return { images, loading, error, refetch: fetchImages };
}
```

### Step 3: Next.js API Routes for File Retrieval

#### User Avatar API Route
**File: `frontend/src/app/api/user/avatar/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    const response = await fetch(`${backendUrl}/api/accounts/profile/avatar/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch avatar' }, { status: response.status });
    }

    const avatarData = await response.json();
    return NextResponse.json(avatarData);

  } catch (error) {
    console.error('Error fetching avatar:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
```

### Step 4: Avatar Display Components

#### Reusable Avatar Component
**File: `frontend/src/components/ui/Avatar.tsx`**
```typescript
import { useState } from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-2xl'
};

export function Avatar({ src, alt, size = 'md', fallback, className = '' }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const showImage = src && !imageError;
  const sizeClass = sizeClasses[size];

  return (
    <div className={`relative ${sizeClass} ${className}`}>
      {showImage ? (
        <>
          <img
            src={src}
            alt={alt || 'Avatar'}
            className={`${sizeClass} rounded-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
          {imageLoading && (
            <div className={`absolute inset-0 ${sizeClass} rounded-full bg-gray-200 animate-pulse`} />
          )}
        </>
      ) : (
        <div className={`${sizeClass} rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold`}>
          {fallback || <User className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-8 h-8'}`} />}
        </div>
      )}
    </div>
  );
}
```

#### User-Specific Avatar Component
**File: `frontend/src/components/ui/UserAvatar.tsx`**
```typescript
import { useUserAvatar } from '@/hooks/useUserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from './Avatar';

interface UserAvatarProps {
  userId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showOnlineStatus?: boolean;
}

export function UserAvatar({ size = 'md', className, showOnlineStatus }: UserAvatarProps) {
  const { user } = useAuth();
  const { avatar, loading } = useUserAvatar();

  if (loading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className={`rounded-full bg-gray-200 ${
          size === 'sm' ? 'w-8 h-8' : 
          size === 'md' ? 'w-10 h-10' : 
          size === 'lg' ? 'w-16 h-16' : 'w-24 h-24'
        }`} />
      </div>
    );
  }

  const fallbackInitials = user?.first_name && user?.last_name 
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : user?.username?.[0]?.toUpperCase() || 'U';

  return (
    <div className={`relative ${className}`}>
      <Avatar
        src={avatar?.avatar_url}
        alt={`${user?.first_name || user?.username || 'User'}'s avatar`}
        size={size}
        fallback={fallbackInitials}
      />
      {showOnlineStatus && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
      )}
    </div>
  );
}
```

### Step 5: Update Existing Components

#### Update Header Component
**File: `frontend/src/components/layout/Header.tsx`**
```typescript
// Replace the existing avatar div with:
import { UserAvatar } from '@/components/ui/UserAvatar';

// In the dropdown trigger:
<UserAvatar size="sm" className="mr-2" />
```

#### Update Dashboard Sidebar
**File: `frontend/src/components/layout/DashboardLayout.tsx`**
```typescript
// Replace the user avatar section with:
<UserAvatar size="md" />
```

#### Update Profile Page
**File: `frontend/src/app/dashboard/profile/page.tsx`**
```typescript
// Replace the profile avatar with:
<UserAvatar size="xl" className="mb-4" />
```

### Step 6: Property Image Display

#### Update Property Cards
**File: `frontend/src/components/ui/PropertyCard.tsx`** (create if doesn't exist)
```typescript
import { usePropertyImages } from '@/hooks/usePropertyImages';

export function PropertyCard({ property }: { property: any }) {
  const { images, loading } = usePropertyImages(property.id);
  const mainImage = images[0]?.blob_url || property.photo_main;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        {loading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        ) : mainImage ? (
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Building2 className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>
      {/* Property details */}
    </div>
  );
}
```

## 🧪 Testing Strategy

### 1. Avatar Display Testing
- Upload avatar via settings page
- Verify avatar appears in header dropdown
- Check avatar in sidebar
- Confirm avatar in profile page
- Test fallback initials when no avatar

### 2. Property Image Testing  
- Create property with images
- Verify images appear in property cards
- Check property detail page gallery
- Test image loading states
- Confirm fallback for properties without images

### 3. Performance Testing
- Test image loading performance
- Verify caching behavior
- Check mobile responsiveness
- Test with large image files

## 📊 Success Metrics

### User Experience
- ✅ Avatars load within 2 seconds
- ✅ Smooth fallback to initials
- ✅ Consistent avatar display across all pages
- ✅ Property images enhance listing attractiveness

### Technical Performance
- ✅ Image caching reduces repeat requests
- ✅ Lazy loading improves page load times
- ✅ Error handling prevents broken image displays
- ✅ API response times under 500ms

## 🚀 Implementation Timeline

### Week 1: Backend & API Routes
- Day 1-2: Django avatar/file retrieval endpoints
- Day 3-4: Next.js API routes for file retrieval
- Day 5: Testing and validation

### Week 2: Frontend Components
- Day 1-2: Avatar components and hooks
- Day 3-4: Update existing components
- Day 5: Property image integration

### Week 3: Testing & Polish
- Day 1-2: Comprehensive testing
- Day 3-4: Performance optimization
- Day 5: Documentation and deployment

This implementation will transform your file upload system into a complete file display solution, giving users immediate visual feedback of their uploaded content throughout the application!
