# Property Listings Pagination Implementation

This document describes the robust, scalable pagination system implemented for property listings in the XlideLand platform.

## Overview

The pagination system provides:

- **12 properties per page** for main listings
- **6 properties per page** for featured listings
- **15 properties per page** for search results
- Backward compatibility with existing code
- Reusable components and hooks
- Proper error handling and loading states

## Architecture

### Backend (Django)

#### Pagination Classes (`backend/listings/views.py`)

```python
# Main listings pagination (12 per page)
class CustomPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'limit'
    max_page_size = 100

# Featured listings pagination (6 per page)
class FeaturedListingsPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'limit'
    max_page_size = 20

# Search results pagination (15 per page)
class SearchListingsPagination(PageNumberPagination):
    page_size = 15
    page_size_query_param = 'limit'
    max_page_size = 50
```

#### API Endpoints

- `GET /api/listings/` - Main listings with pagination
- `GET /api/listings/featured/` - Featured listings with pagination
- `GET /api/listings/search/` - Search results with pagination
- `GET /api/listings/featured/legacy/` - Legacy featured listings (non-paginated)
- `GET /api/listings/search/legacy/` - Legacy search (non-paginated)

### Frontend (React/TypeScript)

#### Core Components

1. **Pagination Component** (`frontend/src/components/ui/Pagination.tsx`)
   - Reusable pagination UI component
   - Supports compact mode for mobile
   - Configurable page numbers display
   - Loading states and disabled states

2. **Pagination Hook** (`frontend/src/hooks/usePagination.ts`)
   - Manages pagination state
   - Provides navigation functions
   - Helper utilities for pagination logic

3. **Listings Hooks** (`frontend/src/hooks/useListings.ts`)
   - `useListings()` - Main listings with pagination
   - `useFeaturedListings()` - Featured listings with pagination
   - `useListingSearch()` - Search with pagination
   - Legacy hooks for backward compatibility

#### Type Definitions

```typescript
interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  has_next: boolean;
  has_previous: boolean;
  next_page: number | null;
  previous_page: number | null;
}

interface PaginatedResponse<T> {
  results: T[];
  count: number;
  pagination?: PaginationInfo;
}
```

## Usage Examples

### Basic Usage

```tsx
import { useListings } from '@/hooks/useListings'
import Pagination from '@/components/ui/Pagination'

function ListingsPage() {
  const {
    listings,
    loading,
    error,
    pagination,
    goToPage,
    nextPage,
    previousPage,
    setLimit
  } = useListings({}, { page: 1, limit: 12 })

  return (
    <div>
      {/* Display listings */}
      {listings.map(listing => (
        <div key={listing.id}>{listing.title}</div>
      ))}
      
      {/* Pagination controls */}
      {pagination && (
        <Pagination
          pagination={pagination}
          onPageChange={goToPage}
          onNext={nextPage}
          onPrevious={previousPage}
          loading={loading}
        />
      )}
    </div>
  )
}
```

### Featured Listings

```tsx
import { useFeaturedListings } from '@/hooks/useListings'

function FeaturedSection() {
  const { featuredListings, pagination, goToPage } = useFeaturedListings({
    page: 1,
    limit: 6
  })

  return (
    <div>
      {featuredListings.map(listing => (
        <div key={listing.id}>{listing.title}</div>
      ))}
      
      {pagination && (
        <Pagination
          pagination={pagination}
          onPageChange={goToPage}
          onNext={() => goToPage(pagination.page + 1)}
          onPrevious={() => goToPage(pagination.page - 1)}
          compact // Use compact mode for featured sections
        />
      )}
    </div>
  )
}
```

### Search Results

```tsx
import { useListingSearch } from '@/hooks/useListings'

function SearchResults() {
  const { 
    searchResults, 
    pagination, 
    searchListings, 
    goToPage 
  } = useListingSearch({ page: 1, limit: 15 })

  const handleSearch = (searchParams) => {
    searchListings(searchParams)
  }

  return (
    <div>
      {searchResults.map(listing => (
        <div key={listing.id}>{listing.title}</div>
      ))}
      
      {pagination && (
        <Pagination
          pagination={pagination}
          onPageChange={goToPage}
          onNext={() => goToPage(pagination.page + 1)}
          onPrevious={() => goToPage(pagination.page - 1)}
          showInfo={true}
        />
      )}
    </div>
  )
}
```

### Pagination Component Props

```tsx
interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  showPageNumbers?: boolean;     // Show numbered page buttons
  showInfo?: boolean;            // Show "X of Y results" text
  maxVisiblePages?: number;      // Number of page buttons to show
  loading?: boolean;             // Disable during loading
  className?: string;            // Custom CSS classes
  compact?: boolean;             // Use compact mobile-friendly layout
}
```

## API Response Format

All paginated endpoints return responses in this format:

```json
{
  "results": [...],
  "count": 156,
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 156,
    "pages": 13,
    "has_next": true,
    "has_previous": false,
    "next_page": 2,
    "previous_page": null
  }
}
```

## Configuration

### Backend Settings

In `backend/core/settings.py`:

```python
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 12,
}
```

### Frontend Defaults

- Main listings: 12 per page
- Featured listings: 6 per page
- Search results: 15 per page
- Maximum page size: 100 (configurable per endpoint)

## Backward Compatibility

Legacy endpoints and hooks are provided for existing code:

- `GET /api/listings/featured/legacy/` - Non-paginated featured listings
- `GET /api/listings/search/legacy/` - Non-paginated search
- `useAllListings()` - Hook for all listings (up to 100)
- `useAllFeaturedListings()` - Hook for all featured listings (up to 50)

## Testing

### Backend Tests

```python
# Test pagination parameters
response = client.get('/api/listings/?page=2&limit=24')
assert response.status_code == 200
assert response.data['pagination']['page'] == 2
assert response.data['pagination']['limit'] == 24
```

### Frontend Tests

```tsx
// Test pagination hook
const { result } = renderHook(() => useListings({}, { page: 1, limit: 12 }))
expect(result.current.pagination?.page).toBe(1)
expect(result.current.pagination?.limit).toBe(12)
```

## Performance Considerations

1. **Database Optimization**: Use proper indexing on `list_date`, `price`, and other sortable fields
2. **Caching**: Consider implementing Redis caching for frequently accessed pages
3. **Lazy Loading**: Images are loaded lazily in the frontend
4. **Debouncing**: Search queries are debounced to prevent excessive API calls

## Future Enhancements

1. **Infinite Scroll**: Add option for infinite scroll pagination
2. **URL State**: Sync pagination state with URL parameters
3. **Prefetching**: Prefetch next page for better UX
4. **Advanced Filters**: Add more filtering options with pagination
5. **Analytics**: Track pagination usage for optimization

## File Structure

```
backend/
├── listings/
│   ├── views.py              # Pagination classes and API views
│   ├── urls.py               # URL routing
│   └── serializers.py        # Data serialization

frontend/
├── src/
│   ├── components/ui/
│   │   └── Pagination.tsx    # Reusable pagination component
│   ├── hooks/
│   │   ├── usePagination.ts  # Pagination state management
│   │   └── useListings.ts    # Listings hooks with pagination
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   └── lib/
│       └── api.ts            # API client with pagination support
```

## Best Practices

1. **Always handle loading states** in the UI
2. **Provide clear pagination information** to users
3. **Use appropriate page sizes** for different content types
4. **Implement proper error handling** for pagination failures
5. **Consider mobile experience** with compact pagination
6. **Maintain backward compatibility** when updating pagination
7. **Use semantic HTML** for accessibility
8. **Test pagination thoroughly** across different scenarios

This pagination system provides a solid foundation for scaling property listings while maintaining good user experience and performance.
