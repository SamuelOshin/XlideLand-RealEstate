'use client'

import React, { useState } from 'react'
import { useListings, useFeaturedListings, useListingSearch } from '@/hooks/useListings'
import { convertListingToProperty } from '@/hooks/useListings'
import Pagination from '@/components/ui/Pagination'
import { Listing } from '@/types'

interface ListingsPageProps {
  searchQuery?: string
  filters?: any
}

const ListingsPage: React.FC<ListingsPageProps> = ({ searchQuery, filters }) => {
  const [searchMode, setSearchMode] = useState(false)
  const [searchParams, setSearchParams] = useState<any>({})

  // Main listings with pagination
  const {
    listings,
    loading: listingsLoading,
    error: listingsError,
    pagination: listingsPagination,
    goToPage: goToListingsPage,
    nextPage: nextListingsPage,
    previousPage: previousListingsPage,
    setLimit: setListingsLimit,
    refetch: refetchListings
  } = useListings(filters, { 
    page: 1, 
    limit: 12, 
    enabled: !searchMode 
  })

  // Featured listings with pagination
  const {
    featuredListings,
    loading: featuredLoading,
    error: featuredError,
    pagination: featuredPagination,
    goToPage: goToFeaturedPage,
    nextPage: nextFeaturedPage,
    previousPage: previousFeaturedPage
  } = useFeaturedListings({ 
    page: 1, 
    limit: 6 
  })

  // Search functionality
  const {
    searchResults,
    loading: searchLoading,
    error: searchError,
    pagination: searchPagination,
    searchListings,
    goToPage: goToSearchPage,
    nextPage: nextSearchPage,
    previousPage: previousSearchPage
  } = useListingSearch({ 
    page: 1, 
    limit: 15, 
    enabled: searchMode 
  })

  const handleSearch = (params: any) => {
    setSearchParams(params)
    setSearchMode(true)
    searchListings(params)
  }

  const handleClearSearch = () => {
    setSearchMode(false)
    setSearchParams({})
    refetchListings()
  }

  const handleLimitChange = (newLimit: number) => {
    setListingsLimit(newLimit)
  }

  const renderListingCard = (listing: Listing) => {
    const property = convertListingToProperty(listing)
    
    return (
      <div key={listing.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
          <span className="text-xl font-bold text-blue-600">${property.price.toLocaleString()}</span>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>{property.bedrooms} bed</span>
            <span>{property.bathrooms} bath</span>
            <span>{property.area} sqft</span>
          </div>
          <div className="text-gray-500">
            {property.location.address}, {property.location.city}, {property.location.state}
          </div>
        </div>
        
        {property.images.length > 0 && (
          <div className="mt-4">
            <img 
              src={property.images[0]} 
              alt={property.title}
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Property Listings</h1>
        
        {/* Search Controls */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => handleSearch({ q: 'test' })}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Search Properties
          </button>
          
          {searchMode && (
            <button
              onClick={handleClearSearch}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Clear Search
            </button>
          )}
          
          <select
            onChange={(e) => handleLimitChange(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md"
            disabled={searchMode}
          >
            <option value={12}>12 per page</option>
            <option value={24}>24 per page</option>
            <option value={48}>48 per page</option>
          </select>
        </div>
      </div>

      {/* Featured Listings Section */}
      {!searchMode && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Properties</h2>
          
          {featuredLoading && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          {featuredError && (
            <div className="text-red-600 text-center p-4">
              Error loading featured properties: {featuredError}
            </div>
          )}
          
          {featuredListings.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {featuredListings.map(renderListingCard)}
              </div>
              
              {featuredPagination && (
                <Pagination
                  pagination={featuredPagination}
                  onPageChange={goToFeaturedPage}
                  onNext={nextFeaturedPage}
                  onPrevious={previousFeaturedPage}
                  loading={featuredLoading}
                  className="mt-6"
                  compact
                />
              )}
            </>
          )}
        </div>
      )}

      {/* Main Listings or Search Results */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          {searchMode ? 'Search Results' : 'All Properties'}
        </h2>
        
        {(listingsLoading || searchLoading) && (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {(listingsError || searchError) && (
          <div className="text-red-600 text-center p-4">
            Error loading properties: {listingsError || searchError}
          </div>
        )}
        
        {/* Display listings or search results */}
        {(searchMode ? searchResults : listings).length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {(searchMode ? searchResults : listings).map(renderListingCard)}
            </div>
            
            {/* Pagination */}
            {(searchMode ? searchPagination : listingsPagination) && (
              <Pagination
                pagination={searchMode ? searchPagination! : listingsPagination!}
                onPageChange={searchMode ? goToSearchPage : goToListingsPage}
                onNext={searchMode ? nextSearchPage : nextListingsPage}
                onPrevious={searchMode ? previousSearchPage : previousListingsPage}
                loading={searchMode ? searchLoading : listingsLoading}
                className="mt-8"
                showInfo={true}
                showPageNumbers={true}
              />
            )}
          </>
        )}
        
        {/* No results message */}
        {!listingsLoading && !searchLoading && (searchMode ? searchResults : listings).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchMode ? 'No properties found matching your search.' : 'No properties available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ListingsPage
