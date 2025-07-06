'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { favoritesAPI } from '@/lib/api'
import { UserFavorite } from '@/types'
import { redirectToAuth } from '@/lib/auth-utils'
import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  DollarSign,
  Eye,
  Share2,
  Filter,
  Search,
  Grid3X3,
  List,
  SortAsc,
  Star,
  ChevronRight,
  ExternalLink,
  Trash2,
  RefreshCw,
  AlertCircle,
  Building2
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function SavedPropertiesPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [favorites, setFavorites] = useState<UserFavorite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'title'>('date')
  useEffect(() => {
    if (!isAuthenticated) {
      redirectToAuth(router)
      return
    }
    loadFavorites()
  }, [isAuthenticated, router])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      setError(null)
      const favoritesData = await favoritesAPI.getFavorites()
      setFavorites(favoritesData)
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Failed to load saved properties')
      console.error('Favorites loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (favoriteId: number) => {
    try {
      await favoritesAPI.removeFavorite(favoriteId)
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId))
    } catch (err) {
      const error = err as Error
      console.error('Remove favorite error:', error)
    }
  }

  const filteredAndSortedFavorites = favorites
    .filter(favorite => {      if (!searchTerm) return true
      const searchLower = searchTerm.toLowerCase()
      return (
        favorite.property.title.toLowerCase().includes(searchLower) ||
        favorite.property.location.address.toLowerCase().includes(searchLower) ||
        favorite.property.location.city.toLowerCase().includes(searchLower)
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.property.price - a.property.price
        case 'title':
          return a.property.title.localeCompare(b.property.title)
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your saved properties...</p>
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
              onClick={loadFavorites}
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
            <h1 className="text-2xl font-bold text-gray-900">Saved Properties</h1>
            <p className="text-gray-600">
              {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search saved properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="date">Sort by Date Saved</option>
              <option value="price">Sort by Price</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>

        {/* Properties List */}
        {filteredAndSortedFavorites.length === 0 ? (
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
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        ) : (
          <div className={`${viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }`}>
            {filteredAndSortedFavorites.map((favorite) => (
              <div
                key={favorite.id}
                className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Property Image */}
                <div className={`relative ${
                  viewMode === 'list' ? 'w-48 h-32' : 'w-full h-48'
                }`}>                  {favorite.property.images && favorite.property.images.length > 0 ? (
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
                  
                  {/* Remove from Favorites Button */}
                  <button
                    onClick={() => removeFavorite(favorite.id)}
                    className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
                  >
                    <Heart className="h-4 w-4 text-red-600 fill-current" />
                  </button>
                  
                  {/* Saved Date Badge */}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    Saved {new Date(favorite.created_at).toLocaleDateString()}
                  </div>
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
                        {favorite.property.location.address}, {favorite.property.location.city}, {favorite.property.location.state}
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
                        </div>                        <div className="flex items-center">
                          <Square className="h-4 w-4 mr-1" />
                          <span className="text-sm">{favorite.property.area?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <button className="flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </button>
                        <button className="flex items-center text-gray-600 hover:text-gray-700 text-sm font-medium">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFavorite(favorite.id)}
                        className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>            
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
