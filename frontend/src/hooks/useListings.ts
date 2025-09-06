import { useState, useEffect, useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listingsAPI } from '@/lib/api'
import { Listing, Property, PaginationInfo, PaginatedResponse } from '@/types'
import { usePagination, createPaginationParams } from './usePagination'

interface PaginationOptions {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

// Hook for fetching all listings with optional filters and pagination
export const useListings = (filters?: any, options: PaginationOptions = {}) => {
  const { page: initialPage = 1, limit: initialLimit = 12, enabled = true } = options;
  
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [currentLimit, setCurrentLimit] = useState(initialLimit)

  // 🔧 FIX: Memoize filters to prevent unnecessary recreations
  const memoizedFilters = useMemo(() => filters || {}, [filters])

  const fetchListings = useCallback(async (pageNum = currentPage, limitNum = currentLimit) => {
    if (!enabled) {
      setListings([])
      setPagination(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Add pagination parameters to filters
      const paginatedFilters = createPaginationParams(pageNum, limitNum, memoizedFilters)
      
      const response = await listingsAPI.getListings(paginatedFilters) as PaginatedResponse<Listing>
      setListings(response.results)
      
      // Set pagination from backend response if available
      if (response.pagination) {
        setPagination(response.pagination)
      } else {
        // Create pagination info manually if not provided by backend
        const totalPages = Math.ceil(response.count / limitNum)
        setPagination({
          page: pageNum,
          limit: limitNum,
          total: response.count,
          pages: totalPages,
          has_next: pageNum < totalPages,
          has_previous: pageNum > 1,
          next_page: pageNum < totalPages ? pageNum + 1 : null,
          previous_page: pageNum > 1 ? pageNum - 1 : null
        })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch listings')
      console.error('Error fetching listings:', err)
      setListings([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [enabled, memoizedFilters]) // 🔧 FIX: Remove currentPage and currentLimit from dependencies

  const goToPage = useCallback((pageNum: number) => {
    if (pageNum >= 1 && (pagination?.pages === undefined || pageNum <= pagination.pages)) {
      setCurrentPage(pageNum)
      // fetchListings will be called by useEffect when currentPage changes
    }
  }, [pagination?.pages]); // 🔧 FIX: Remove fetchListings dependency

  const nextPage = useCallback(() => {
    if (pagination?.has_next) {
      setCurrentPage(prev => prev + 1);
    }
  }, [pagination?.has_next]); // 🔧 FIX: Remove goToPage dependency

  const previousPage = useCallback(() => {
    if (pagination?.has_previous) {
      setCurrentPage(prev => prev - 1);
    }
  }, [pagination?.has_previous]); // 🔧 FIX: Remove goToPage dependency

  const setLimit = useCallback((newLimit: number) => {
    setCurrentLimit(newLimit)
    setCurrentPage(1) // Reset to first page when changing limit
    // fetchListings will be called by useEffect when currentLimit changes
  }, []) // 🔧 FIX: Remove fetchListings dependency

  const reset = useCallback(() => {
    setCurrentPage(initialPage)
    setCurrentLimit(initialLimit)
    setPagination(null)
    // fetchListings will be called by useEffect when currentPage/currentLimit change
  }, [initialPage, initialLimit]) // 🔧 FIX: Remove fetchListings dependency

  // 🔧 FIX: Only trigger initial fetch, not on every fetchListings change
  useEffect(() => {
    fetchListings(currentPage, currentLimit)
  }, [enabled, memoizedFilters]) // 🔧 FIX: Remove fetchListings from dependencies

  // 🔧 FIX: Separate effect for page/limit changes to avoid infinite loops
  useEffect(() => {
    if (enabled) {
      fetchListings(currentPage, currentLimit)
    }
  }, [currentPage, currentLimit])

  const refetch = useCallback(() => {
    fetchListings(currentPage, currentLimit)
  }, [currentPage, currentLimit, fetchListings]) // Keep fetchListings for manual refetch

  return {
    listings,
    loading,
    error,
    pagination,
    refetch,
    goToPage,
    nextPage,
    previousPage,
    setLimit,
    reset,
    // Legacy support
    totalCount: pagination?.total || 0,
  }
}

// Hook for fetching featured listings with pagination
export const useFeaturedListings = (options: PaginationOptions = {}) => {
  const { page = 1, limit = 6, enabled = true } = options; // Default 6 for featured

  const {
    data: response,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['featured-listings', page, limit],
    queryFn: async () => {
      const result = await listingsAPI.getFeaturedListings({
        page,
        limit
      }) as PaginatedResponse<Listing>;
      return result;
    },
    enabled,
    staleTime: 15 * 60 * 1000, // 15 minutes - increased to prevent continuous hits
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, err: any) => {
      // Don't retry on 4xx errors
      if (err?.response?.status >= 400 && err?.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const featuredListings = response?.results || [];
  const pagination = response?.pagination || null;

  const goToPage = (pageNum: number) => {
    // This will trigger a new query with the updated page
    // React Query will handle deduplication automatically
  };

  const nextPage = () => {
    if (pagination?.has_next) {
      goToPage(pagination.page + 1);
    }
  };

  const previousPage = () => {
    if (pagination?.has_previous) {
      goToPage(pagination.page - 1);
    }
  };

  return {
    featuredListings,
    loading,
    error: error?.message || null,
    pagination,
    refetch,
    goToPage,
    nextPage,
    previousPage,
  };
}

// Hook for fetching a single listing
export const useListing = (listingId: number | null) => {
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchListing = async () => {
    if (!listingId) return

    try {
      setLoading(true)
      setError(null)
      const listing = await listingsAPI.getListing(listingId)
      setListing(listing)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch listing')
      console.error('Error fetching listing:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListing()
  }, [listingId])

  const refetch = () => {
    fetchListing()
  }

  return {
    listing,
    loading,
    error,
    refetch
  }
}

// Utility function to convert Listing to Property format for components
export const convertListingToProperty = (listing: any): Property => {
  // Helper function to validate and filter photo URLs
  const validatePhotoUrl = (url: string): boolean => {
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return false;
    }
    
    // Remove common invalid values
    const invalidValues = ['null', 'undefined', 'None', '', ' '];
    if (invalidValues.includes(url.trim())) {
      return false;
    }
    
    // Check if it's a valid URL format
    try {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        new URL(url);
        return true;
      }
      // If it's a relative path, it should start with / or be a relative path
      if (url.startsWith('/') || !url.includes('://')) {
        return true;
      }
    } catch {
      return false;
    }
    
    return false;
  };

  return {
    id: parseInt(listing.id),
    title: listing.title,
    description: listing.description?.trim() || 'No description available',
    price: listing.price,
    listing_type: listing.listing_type || 'sale',
    property_type: listing.property_type || 'house',
    category: listing.category,
    bedrooms: listing.bedrooms,
    bathrooms: parseFloat(listing.bathrooms) || 0,
    area: listing.sqft || 0,
    sqft: listing.sqft || 0,
    lot_size: listing.lot_size,
    year_built: listing.year_built,
    floors: listing.floors || 1,
    fireplaces: listing.fireplaces || 0,
    parking_spaces: listing.parking_spaces || 0,
    garage: listing.garage || 0,
    heating: listing.heating || 'central',
    cooling: listing.cooling || 'central',
    hoa_fee: listing.hoa_fee,
    property_taxes: listing.property_taxes,
    location: {
      address: listing.address,
      city: listing.city,
      state: listing.state,
      zipCode: listing.zipcode || '',
      neighborhood: listing.neighborhood || listing.city
    },
    images: [
      listing.photo_main,
      listing.photo_1,
      listing.photo_2,
      listing.photo_3,
      listing.photo_4,
      listing.photo_5,
      listing.photo_6
    ].filter((photo): photo is string => Boolean(photo) && validatePhotoUrl(photo)),
    features: listing.features || [],
    realtor: listing.realtor || {
      id: 0,
      name: listing.realtor_name || 'Unknown Realtor',
      title: 'Real Estate Agent',
      email: '',
      phone: '',
      photo: '',
      years_experience: 0,
      total_sales_count: 0,
      total_sales_volume: 0,
      average_rating: 0,
      total_reviews: 0,
      languages: 'English',
      is_active: true
    },
    createdAt: listing.list_date,
    updatedAt: listing.updated_at || listing.list_date,
    isActive: listing.is_published !== undefined ? listing.is_published : true,
    isFeatured: listing.is_featured || false,
    
    // Analytics and computed fields
    analytics: listing.analytics,
    price_history: listing.price_history,
    days_on_market: listing.days_on_market,
    price_per_sqft: listing.price_per_sqft,
    views: listing.analytics?.views || 0,
    saves: listing.analytics?.saves || 0
  }
}

// Hook for search functionality with pagination
export const useListingSearch = (options: PaginationOptions = {}) => {
  const { page = 1, limit = 15, enabled = true } = options; // Default 15 for search results
  
  const [searchResults, setSearchResults] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [lastSearchParams, setLastSearchParams] = useState<any>(null)

  const searchListings = async (searchParams: any, pageNum = page, limitNum = limit) => {
    if (!enabled) {
      setSearchResults([])
      setPagination(null)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Add pagination to search params
      const paginatedSearchParams = {
        ...searchParams,
        page: pageNum,
        limit: limitNum
      }
      
      // Store last search params for pagination navigation
      setLastSearchParams(searchParams)
      
      const response = await listingsAPI.searchListings(paginatedSearchParams)
      setSearchResults(response.results)
      
      // Set pagination from backend response if available
      if (response.pagination) {
        setPagination(response.pagination)
      } else {
        // Create pagination info manually if not provided by backend
        const totalPages = Math.ceil(response.count / limitNum)
        setPagination({
          page: pageNum,
          limit: limitNum,
          total: response.count,
          pages: totalPages,
          has_next: pageNum < totalPages,
          has_previous: pageNum > 1,
          next_page: pageNum < totalPages ? pageNum + 1 : null,
          previous_page: pageNum > 1 ? pageNum - 1 : null
        })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search listings')
      console.error('Error searching listings:', err)
      setSearchResults([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }

  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && (pagination?.pages === undefined || pageNum <= pagination.pages) && lastSearchParams) {
      searchListings(lastSearchParams, pageNum, limit);
    }
  };

  const nextPage = () => {
    if (pagination?.has_next && lastSearchParams) {
      searchListings(lastSearchParams, pagination.page + 1, limit);
    }
  };

  const previousPage = () => {
    if (pagination?.has_previous && lastSearchParams) {
      searchListings(lastSearchParams, pagination.page - 1, limit);
    }
  };

  return {
    searchResults,
    loading,
    error,
    pagination,
    searchListings,
    goToPage,
    nextPage,
    previousPage,
    // Legacy support
    totalCount: pagination?.total || 0,
  }
}

// Legacy hooks for backward compatibility (non-paginated)
export const useAllListings = (filters?: any) => {
  return useListings(filters, { limit: 100 }); // Get up to 100 listings at once
}

export const useAllFeaturedListings = () => {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFeaturedListings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use legacy API for backward compatibility
      const listings = await listingsAPI.getFeaturedListingsLegacy()
      setFeaturedListings(listings)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch featured listings')
      console.error('Error fetching featured listings:', err)
      setFeaturedListings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeaturedListings()
  }, [])

  const refetch = () => {
    fetchFeaturedListings()
  }

  return {
    featuredListings,
    loading,
    error,
    refetch,
  }
}
