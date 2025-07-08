# Property Images Pagination Implementation

## Overview

This implementation adds pagination support to the property images API endpoint, allowing for efficient loading and display of large sets of property images. The pagination is implemented across the full stack: Django backend, Next.js API routes, React hooks, and UI components.

## Features

- **Backend Pagination**: Django API supports pagination with configurable page size
- **Frontend Pagination**: Next.js API routes pass through pagination parameters
- **React Hooks**: Enhanced `usePropertyImages` hook with pagination support
- **UI Components**: Reusable pagination component with page numbers and navigation
- **Image Gallery**: Complete gallery component with grid/list views and pagination
- **Backward Compatibility**: Legacy hooks maintained for existing code

## Implementation Details

### Backend (Django)

#### API Endpoint
```
GET /api/accounts/properties/{property_id}/images/?page=1&limit=10
```

#### Parameters
- `page`: Page number (default: 1)
- `limit`: Images per page (default: 10, max: 50)

#### Response Format
```json
{
  "uploaded_images": [...],
  "traditional_photos": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total_images": 25,
    "total_uploaded_images": 20,
    "total_traditional_photos": 5,
    "total_pages": 3,
    "has_next": true,
    "has_previous": false,
    "next_page": 2,
    "previous_page": null
  },
  "property_id": "123"
}
```

### Frontend (Next.js)

#### API Route
```
GET /api/properties/{propertyId}/images?page=1&limit=10
```

The Next.js API route validates parameters and forwards them to the Django backend.

#### React Hook

```typescript
// Paginated hook
const { images, loading, error, pagination, goToPage, nextPage, previousPage } = 
  usePropertyImages(propertyId, { page: 1, limit: 10 });

// Legacy hook (for backward compatibility)
const { images, loading, error } = useAllPropertyImages(propertyId);
```

#### Components

1. **Pagination Component** (`/components/ui/Pagination.tsx`)
   - Reusable pagination controls
   - Page number display
   - Previous/Next navigation
   - Responsive design

2. **PropertyImageGallery** (`/components/PropertyImageGallery.tsx`)
   - Complete gallery with pagination
   - Grid and list view modes
   - Image download and sharing
   - Loading states and error handling

3. **SafeImage** (`/components/ui/SafeImage.tsx`)
   - Safe image loading with fallbacks
   - URL validation
   - Error handling

## Usage Examples

### Basic Usage

```typescript
import { usePropertyImages } from '@/hooks/usePropertyImages';
import Pagination from '@/components/ui/Pagination';

const MyComponent = ({ propertyId }) => {
  const { images, loading, pagination, goToPage, nextPage, previousPage } = 
    usePropertyImages(propertyId, { page: 1, limit: 12 });

  return (
    <div>
      {/* Display images */}
      <div className="grid grid-cols-4 gap-4">
        {images.map(image => (
          <img key={image.id} src={image.url} alt={image.file_name} />
        ))}
      </div>
      
      {/* Pagination */}
      {pagination && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.total_pages}
          hasNext={pagination.has_next}
          hasPrevious={pagination.has_previous}
          onPageChange={goToPage}
          onNext={nextPage}
          onPrevious={previousPage}
        />
      )}
    </div>
  );
};
```

### Complete Gallery

```typescript
import PropertyImageGallery from '@/components/PropertyImageGallery';

const PropertyPage = ({ propertyId }) => {
  return (
    <PropertyImageGallery
      propertyId={propertyId}
      title="Property Images"
      imagesPerPage={16}
      viewMode="grid"
      showControls={true}
    />
  );
};
```

## Configuration Options

### Hook Options
- `page`: Current page number (default: 1)
- `limit`: Images per page (default: 10, max: 50)
- `enabled`: Whether to fetch images (default: true)

### Gallery Options
- `imagesPerPage`: Number of images per page
- `viewMode`: 'grid' or 'list' view
- `showControls`: Show view mode toggle buttons
- `showTitle`: Show gallery title and image count

## Performance Considerations

1. **Lazy Loading**: Images are loaded on-demand per page
2. **Caching**: React hooks cache results for better performance
3. **Optimized Images**: SafeImage component handles optimization
4. **Reasonable Limits**: Maximum 50 images per page to prevent overload

## Error Handling

- Invalid pagination parameters return 400 status
- Database errors return 500 status with error messages
- Frontend handles network errors gracefully
- SafeImage component provides fallback images

## Testing

A test page is available at `/test/property-images` that demonstrates:
- Different pagination configurations
- Grid and list view modes
- API endpoint testing
- Real-time parameter adjustment

## API Endpoints Summary

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/properties/{id}/images` | GET | Get paginated property images |
| `/api/accounts/properties/{id}/images/` | GET | Django backend endpoint |

## Files Modified/Created

### Backend
- `backend/accounts/views.py` - Added pagination to `get_property_images`

### Frontend
- `frontend/src/app/api/properties/[propertyId]/images/route.ts` - Added pagination parameters
- `frontend/src/hooks/usePropertyImages.ts` - Enhanced with pagination support
- `frontend/src/components/ui/Pagination.tsx` - New pagination component
- `frontend/src/components/ui/SafeImage.tsx` - Safe image component with validation
- `frontend/src/components/PropertyImageGallery.tsx` - Complete gallery component
- `frontend/src/app/test/property-images/page.tsx` - Test page

## Backward Compatibility

The `useAllPropertyImages` hook maintains backward compatibility for existing components like `PropertyCard` that don't need pagination.

## Future Enhancements

1. **Infinite Scrolling**: Add infinite scroll option
2. **Image Sorting**: Sort by date, size, or custom order
3. **Bulk Operations**: Select multiple images for operations
4. **Advanced Filtering**: Filter by image type, date, or metadata
5. **Image Optimization**: Add different image sizes for different use cases
