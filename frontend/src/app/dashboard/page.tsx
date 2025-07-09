'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {  DashboardStats } from '@/types/index'
import { dashboardAPI } from '@/lib/api'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import {
  Heart,
  Calendar,
  MessageCircle,
  TrendingUp,
  MapPin,
  Star,
  DollarSign,
  Clock,
  Activity,
  Users,
  Building2,
  BarChart3,
  Bell,
  Search,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Timer,
  Eye
} from 'lucide-react'

function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading, role } = useAuth()
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData()
    }
  }, [isAuthenticated, authLoading])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const stats = await dashboardAPI.getStats()
      setDashboardStats(stats)    } catch (err: unknown) {
      const error = err as Error
      setError(error.message || 'Failed to load dashboard data')
      console.error('Dashboard loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const getRoleWelcomeMessage = () => {
    switch (role) {
      case 'admin':
        return 'Manage your platform and monitor performance'
      case 'seller':
        return 'Track your listings and connect with potential buyers'
      case 'buyer':
        return 'Discover your perfect home and manage your search'
      default:
        return 'Welcome to your personalized real estate dashboard'
    }
  }

  const getQuickStats = () => {
    if (!dashboardStats) return []

    const baseStats = [
      { 
        label: 'Saved Properties', 
        value: dashboardStats.properties.favorites_count, 
        icon: Heart, 
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        change: '+12%',
        trend: 'up'
      },
      { 
        label: 'Active Listings', 
        value: dashboardStats.properties.active_listings, 
        icon: Building2, 
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        change: '+5%',
        trend: 'up'
      },
      { 
        label: 'Pending Tours', 
        value: dashboardStats.tours.pending_tours, 
        icon: Calendar, 
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        change: '2 new',
        trend: 'neutral'
      },
      { 
        label: 'Unread Messages', 
        value: dashboardStats.communications.unread_messages, 
        icon: MessageCircle, 
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        change: dashboardStats.communications.unread_messages > 0 ? 'Action needed' : 'All clear',
        trend: dashboardStats.communications.unread_messages > 0 ? 'down' : 'up'
      },
    ]

    if (role === 'admin') {
      return [
        ...baseStats,
        { 
          label: 'Total Properties', 
          value: dashboardStats.properties.total_listings, 
          icon: Users, 
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          change: '+8%',
          trend: 'up'
        },
        { 
          label: 'Active Alerts', 
          value: dashboardStats.alerts.active_alerts, 
          icon: Bell, 
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          change: '3 active',
          trend: 'neutral'
        },
      ]
    }

    return baseStats
  }

  const getRecentActivities = () => {
    if (!dashboardStats?.recent_activities) return []
    
    return dashboardStats.recent_activities.slice(0, 5).map(activity => ({
      id: activity.id,
      type: activity.activity_type,
      description: activity.description,
      time: new Date(activity.created_at).toLocaleString(),
      icon: getActivityIcon(activity.activity_type)
    }))
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'property_view':
        return Eye
      case 'favorite_added':
        return Heart
      case 'tour_scheduled':
        return Calendar
      case 'message_sent':
        return MessageCircle
      case 'alert_created':
        return Bell
      default:
        return Activity
    }
  }

  const getTourStatusStats = () => {
    if (!dashboardStats) return []
    
    return [
      {
        label: 'Pending',
        value: dashboardStats.tours.pending_tours,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50'
      },
      {
        label: 'Confirmed',
        value: dashboardStats.tours.confirmed_tours,
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {        label: 'Completed',
        value: dashboardStats.tours.completed_tours,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      }
    ]
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {getRoleWelcomeMessage()}
              </h1>
              <div className="mt-4 flex items-center space-x-4 text-emerald-100">
                <span className="text-sm">Account since {new Date(user?.date_joined || '').toLocaleDateString()}</span>
                <span className="text-sm">•</span>
                <span className="text-sm capitalize">{role} Account</span>
                {dashboardStats?.communications?.unread_notifications && dashboardStats.communications.unread_notifications > 0 && (
                  <>
                    <span className="text-sm">•</span>
                    <span className="text-sm bg-red-500 px-2 py-1 rounded-full text-xs">
                      {dashboardStats?.communications?.unread_notifications} notifications
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold">
                  {user?.first_name?.[0]?.toUpperCase()}{user?.last_name?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getQuickStats().map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${
                    stat.trend === 'up' ? 'text-green-600' : 
                    stat.trend === 'down' ? 'text-red-600' : 
                    'text-gray-500'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tours Overview */}
        {dashboardStats && dashboardStats.tours.total_tours > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tours Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getTourStatusStats().map((stat, index) => (
                <div key={index} className={`p-4 rounded-lg ${stat.bgColor}`}>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm font-medium ${stat.color}`}>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                <button
                  onClick={() => router.push('/dashboard/analytics')}
                  className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center"
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              
              <div className="space-y-4">
                {getRecentActivities().length > 0 ? (
                  getRecentActivities().map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <activity.icon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{activity.description}</h3>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Communication Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Communications</h2>
                <button
                  onClick={() => router.push('/dashboard/messages')}
                  className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center"
                >
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Active Conversations</p>
                      <p className="text-2xl font-bold text-blue-900">{dashboardStats?.communications.active_conversations || 0}</p>
                    </div>
                    <MessageCircle className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-800">Unread Messages</p>
                      <p className="text-2xl font-bold text-red-900">{dashboardStats?.communications.unread_messages || 0}</p>
                    </div>
                    <Bell className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-800">Notifications</p>
                      <p className="text-2xl font-bold text-purple-900">{dashboardStats?.communications.unread_notifications || 0}</p>
                    </div>
                    <Bell className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Market Insights */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Market Insights</h2>
                <BarChart3 className="h-5 w-5 text-emerald-600" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-emerald-800">Your Properties</p>
                    <p className="text-lg font-bold text-emerald-900">{dashboardStats?.properties.total_listings || 0}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-emerald-600" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Listings</span>
                    <span className="text-sm font-medium text-green-600">{dashboardStats?.properties.active_listings || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Saved Properties</span>
                    <span className="text-sm font-medium text-gray-900">{dashboardStats?.properties.favorites_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Alerts</span>
                    <span className="text-sm font-medium text-orange-600">{dashboardStats?.alerts.active_alerts || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/dashboard/properties')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Building2 className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium text-gray-900">Manage Properties</span>
                </button>
                
                <button
                  onClick={() => router.push('/dashboard/tours')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium text-gray-900">View Tours</span>
                </button>
                
                <button
                  onClick={() => router.push('/dashboard/messages')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium text-gray-900">Messages</span>
                </button>
                
                <button
                  onClick={() => router.push('/dashboard/alerts')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Bell className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium text-gray-900">Property Alerts</span>
                </button>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-emerald-900 mb-4">Platform Status</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-900">System Online</span>
                  </div>
                  <span className="text-sm text-emerald-700">All services operational</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Timer className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-900">Last Updated</span>
                  </div>
                  <span className="text-sm text-emerald-700">Just now</span>
                </div>
                
                {dashboardStats?.communications?.unread_messages && dashboardStats.communications.unread_messages > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-5 w-5 text-amber-600" />
                      <span className="text-sm font-medium text-emerald-900">Action Required</span>
                    </div>
                    <span className="text-sm text-emerald-700">{dashboardStats?.communications?.unread_messages} unread</span>                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Wrap the entire component with ProtectedRoute
export default function DashboardPageWrapper() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  )
}
