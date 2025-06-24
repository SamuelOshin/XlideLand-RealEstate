'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { toursAPI } from '@/lib/api'
import { Tour } from '@/types'
import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Filter,
  Search,
  MessageCircle,
  Navigation,
  Star,
  Edit,
  Trash2,
  Video,
  Car,
  RefreshCw
} from 'lucide-react'

export default function ToursPage() {
  const { user, isAuthenticated } = useAuth()
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      loadTours()
    }
  }, [isAuthenticated, filter])

  const loadTours = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const statusFilter = filter === 'all' ? undefined : filter
      const toursData = await toursAPI.getTours(statusFilter)
      setTours(toursData)
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Failed to load tours')
      console.error('Tours loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelTour = async (tourId: number) => {
    try {
      await toursAPI.cancelTour(tourId)
      await loadTours() // Reload tours
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Failed to cancel tour')
    }
  }

  // Filter tours based on search term and status
  const filteredTours = tours.filter(tour => {
    const matchesSearch = searchTerm === '' || 
      tour.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.property.location.address.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filter === 'all' || tour.status === filter
    
    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-600" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your tours...</p>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Tours</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadTours}
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
            <h1 className="text-2xl font-bold text-gray-900">Property Tours</h1>
            <p className="text-gray-600">Manage your scheduled property viewings</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <Plus className="h-4 w-4" />
            Schedule New Tour
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tours</p>
                <p className="text-2xl font-bold text-gray-900">{tours.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {tours.filter(t => t.status === 'pending').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">
                  {tours.filter(t => t.status === 'confirmed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {tours.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tours by property or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status as any)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg capitalize transition-colors ${
                    filter === status
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tours List */}
        <div className="space-y-4">
          {filteredTours.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tours found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try adjusting your search criteria' : 'You haven\'t scheduled any tours yet'}
              </p>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Schedule Your First Tour
              </button>
            </div>
          ) : (
            filteredTours.map((tour) => (
              <div key={tour.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Property Image */}                  <div className="w-full lg:w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                    {tour.property.images && tour.property.images.length > 0 ? (
                      <img
                        src={tour.property.images[0]}
                        alt={tour.property.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Building2 className="h-8 w-8 text-gray-400" />
                    )}
                  </div>

                  {/* Tour Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {tour.property.title}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{tour.property.location.address}, {tour.property.location.city}, {tour.property.location.state}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(tour.scheduled_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(tour.scheduled_date).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(tour.status)}`}>
                          {getStatusIcon(tour.status)}
                          {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                        </div>
                        <p className="text-lg font-bold text-emerald-600">
                          ${tour.property.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Tour Notes */}
                    {tour.notes && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <strong>Notes:</strong> {tour.notes}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                          <MessageCircle className="h-4 w-4" />
                          Contact Agent
                        </button>
                        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                          <Navigation className="h-4 w-4" />
                          Get Directions
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {tour.status === 'pending' || tour.status === 'confirmed' ? (
                          <button
                            onClick={() => handleCancelTour(tour.id)}
                            className="flex items-center gap-2 px-3 py-1 text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            <XCircle className="h-4 w-4" />
                            Cancel
                          </button>
                        ) : null}
                        
                        <button className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-gray-700 text-sm font-medium">
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )))}
        </div>
      </div>
    </DashboardLayout>
  )
}
