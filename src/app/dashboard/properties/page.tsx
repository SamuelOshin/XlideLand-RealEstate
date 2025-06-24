'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { favoritesAPI, listingsAPI } from '@/lib/api'
import { UserFavorite, Listing } from '@/types'
import { redirectToAuth } from '@/lib/auth-utils'
import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  Building2,
  Heart,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  TrendingUp,
  Eye,
  MapPin,
  Bed,
  Bath,
  Square,
  DollarSign,
  Calendar,
  BarChart3,
  Users,
  Star,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Settings,
  Edit,
  Trash2,
  Share2,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function PropertiesPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'saved' | 'listed' | 'overview'>('overview')
  const [favorites, setFavorites] = useState<UserFavorite[]>([])
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (!isAuthenticated) {
      redirectToAuth(router)
      return
    }
    loadPropertiesData()
  }, [isAuthenticated, router, activeTab])

  const loadPropertiesData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (activeTab === 'saved' || activeTab === 'overview') {
        const favoritesData = await favoritesAPI.getFavorites()
        setFavorites(favoritesData)
      }
      
      // Load user's listings if they have seller/admin role
      if ((activeTab === 'listed' || activeTab === 'overview') && 
          (user?.is_staff || user?.profile?.role === 'seller')) {
        // For now, we'll get all listings since we need user-specific listings endpoint
        const listingsData = await listingsAPI.getListings()
        setListings(listingsData.results || [])
      }
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Failed to load properties data')
      console.error('Properties loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (favoriteId: number) => {
    try {
      await favoritesAPI.removeFavorite(favoriteId)
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId))
    } catch (err) {
      console.error('Remove favorite error:', err)
    }
  }

  const getActiveTabData = () => {
    switch (activeTab) {
      case 'saved':
        return favorites.filter(fav => 
          !searchTerm || 
          fav.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fav.property.location.address.toLowerCase().includes(searchTerm.toLowerCase())
        )
      case 'listed':
        return listings.filter(listing => 
          !searchTerm || 
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.address.toLowerCase().includes(searchTerm.toLowerCase())
        )
      default:
        return []
    }
  }

  const getUserRole = () => {
    if (user?.is_staff) return 'admin'
    if (user?.profile?.role === 'seller') return 'seller'
    return 'buyer'
  }

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saved Properties</p>
              <p className="text-2xl font-bold text-emerald-600">{favorites.length}</p>
            </div>
            <Heart className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="mt-4">
            <Link 
              href="/dashboard/properties/saved"
              className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center"
            >
              View all saved
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {(getUserRole() === 'seller' || getUserRole() === 'admin') && (
          <>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Listed Properties</p>
                  <p className="text-2xl font-bold text-blue-600">{listings.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-4">
                <button 
                  onClick={() => setActiveTab('listed')}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  Manage listings
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month Views</p>
                  <p className="text-2xl font-bold text-purple-600">2,847</p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-4">
                <Link 
                  href="/dashboard/analytics"
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center"
                >
                  View analytics
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </>
        )}

        {getUserRole() === 'buyer' && (
          <>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Scheduled Tours</p>
                  <p className="text-2xl font-bold text-blue-600">3</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-4">
                <Link 
                  href="/dashboard/tours"
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  View tours
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                  <p className="text-2xl font-bold text-purple-600">5</p>
                </div>
                <AlertCircle className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-4">
                <Link 
                  href="/dashboard/alerts"
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center"
                >
                  Manage alerts
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/properties"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
          >
            <Search className="h-6 w-6 text-emerald-600" />
            <div>
              <p className="font-medium text-gray-900">Browse Properties</p>
              <p className="text-sm text-gray-600">Find new listings</p>
            </div>
          </Link>

          {(getUserRole() === 'seller' || getUserRole() === 'admin') && (
            <Link
              href="/dashboard/properties/new"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Plus className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Add Property</p>
                <p className="text-sm text-gray-600">Create new listing</p>
              </div>
            </Link>
          )}

          <Link
            href="/dashboard/tours"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <Calendar className="h-6 w-6 text-purple-600" />
            <div>
              <p className="font-medium text-gray-900">Schedule Tour</p>
              <p className="text-sm text-gray-600">Book property viewing</p>
            </div>
          </Link>

          <Link
            href="/dashboard/insights"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
          >
            <TrendingUp className="h-6 w-6 text-orange-600" />
            <div>
              <p className="font-medium text-gray-900">Market Insights</p>
              <p className="text-sm text-gray-600">View trends</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Heart className="h-5 w-5 text-red-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Saved Modern Loft in Downtown</p>
              <p className="text-sm text-gray-600">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Scheduled tour for Luxury Villa</p>
              <p className="text-sm text-gray-600">Yesterday</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Search className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Search: 3BR houses under $500k</p>
              <p className="text-sm text-gray-600">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSavedProperties = () => {
    const filteredFavorites = getActiveTabData() as UserFavorite[]
    
    if (filteredFavorites.length === 0) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No properties found' : 'No saved properties yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Try adjusting your search criteria' 
              : 'Start browsing properties and save your favorites'
            }
          </p>
          <Link
            href="/properties"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Browse Properties
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      )
    }

    return (
      <div className={`${viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'space-y-4'
      }`}>
        {filteredFavorites.map((favorite) => (
          <div
            key={favorite.id}
            className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
              viewMode === 'list' ? 'flex' : ''
            }`}
          >
            {/* Property Image */}
            <div className={`relative ${
              viewMode === 'list' ? 'w-48 h-32' : 'w-full h-48'
            }`}>
              {favorite.property.images && favorite.property.images.length > 0 ? (
                <Image
                  src={favorite.property.images[0]}
                  alt={favorite.property.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
              )}
              
              <button
                onClick={() => removeFavorite(favorite.id)}
                className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
              >
                <Heart className="h-4 w-4 text-red-600 fill-current" />
              </button>
            </div>

            {/* Property Details */}
            <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {favorite.property.title}
                </h3>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm line-clamp-1">
                    {favorite.property.location.address}, {favorite.property.location.city}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-emerald-600">
                    ${favorite.property.price.toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span className="text-sm">{favorite.property.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span className="text-sm">{favorite.property.bathrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      <span className="text-sm">{favorite.property.area?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/properties/${favorite.property.id}`}
                      className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      <span className="text-sm">View</span>
                    </Link>
                    <button className="flex items-center text-gray-600 hover:text-gray-700 transition-colors">
                      <Share2 className="h-4 w-4 mr-1" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    Saved {new Date(favorite.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderListedProperties = () => {
    const filteredListings = getActiveTabData() as Listing[]
    
    if (filteredListings.length === 0) {
      return (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No listings found' : 'No properties listed yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Try adjusting your search criteria' 
              : 'Start by adding your first property listing'
            }
          </p>
          <Link
            href="/dashboard/properties/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Link>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {filteredListings.map((listing) => (
          <div key={listing.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    {listing.photo_main ? (
                      <Image
                        src={listing.photo_main}
                        alt={listing.title}
                        width={96}
                        height={64}
                        className="object-cover rounded-lg"
                      />
                    ) : (
                      <Building2 className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{listing.title}</h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{listing.address}, {listing.city}, {listing.state}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{listing.bedrooms} beds</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{listing.bathrooms} baths</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        <span>{listing.sqft?.toLocaleString()} sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  ${listing.price?.toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                    <BarChart3 className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>1,234 views</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>8 inquiries</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Listed {new Date(listing.list_date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  listing.is_published 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {listing.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your properties...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Properties</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadPropertiesData}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Properties Management</h1>
            <p className="text-gray-600">
              {getUserRole() === 'buyer' && 'Manage your saved properties and search history'}
              {getUserRole() === 'seller' && 'Manage your property listings and track performance'}
              {getUserRole() === 'admin' && 'Overview of all properties and platform management'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(getUserRole() === 'seller' || getUserRole() === 'admin') && (
              <Link
                href="/dashboard/properties/new"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Property
              </Link>
            )}
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'saved'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Saved Properties ({favorites.length})
              </button>
              {(getUserRole() === 'seller' || getUserRole() === 'admin') && (
                <button
                  onClick={() => setActiveTab('listed')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'listed'
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Listed Properties ({listings.length})
                </button>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && renderOverviewTab()}
            
            {(activeTab === 'saved' || activeTab === 'listed') && (
              <>
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder={`Search ${activeTab} properties...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  
                  {activeTab === 'saved' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === 'grid'
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Grid3X3 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-colors ${
                          viewMode === 'list'
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <List className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Content */}
                {activeTab === 'saved' && renderSavedProperties()}
                {activeTab === 'listed' && renderListedProperties()}
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
