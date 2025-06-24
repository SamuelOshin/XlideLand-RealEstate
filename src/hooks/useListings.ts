import { useState, useEffect } from 'react'
import { listingsAPI } from '@/lib/api'
import { Listing, Property } from '@/types'

// Hook for fetching all listings with optional filters
export const useListings = (filters?: any) => {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  const fetchListings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await listingsAPI.getListings(filters)
      setListings(response.results)
      setTotalCount(response.count)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch listings')
      console.error('Error fetching listings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [JSON.stringify(filters)]) // Re-fetch when filters change

  const refetch = () => {
    fetchListings()
  }

  return {
    listings,
    loading,
    error,
    totalCount,
    refetch
  }
}

// Hook for fetching featured listings
export const useFeaturedListings = () => {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFeaturedListings = async () => {
    try {
      setLoading(true)
      setError(null)
      const listings = await listingsAPI.getFeaturedListings()
      setFeaturedListings(listings)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch featured listings')
      console.error('Error fetching featured listings:', err)
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
    refetch
  }
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
    ].filter((photo): photo is string => Boolean(photo)),
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

// Hook for search functionality
export const useListingSearch = () => {
  const [searchResults, setSearchResults] = useState<Listing[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  const searchListings = async (searchParams: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await listingsAPI.searchListings(searchParams)
      setSearchResults(response.results)
      setTotalCount(response.count)
    } catch (err: any) {
      setError(err.message || 'Failed to search listings')
      console.error('Error searching listings:', err)
    } finally {
      setLoading(false)
    }
  }

  return {
    searchResults,
    loading,
    error,
    totalCount,
    searchListings
  }
}
