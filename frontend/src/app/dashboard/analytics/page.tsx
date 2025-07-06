'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { dashboardAPI, activitiesAPI } from '@/lib/api'
import { UserActivity } from '@/types'
import { redirectToAuth } from '@/lib/auth-utils'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  Users,
  Building2,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Eye,
  MessageCircle,
  Calendar,
  MapPin,
  Star,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart
} from 'lucide-react'

interface AnalyticsData {
  totalViews: number
  totalSaves: number
  totalInquiries: number
  totalTours: number
  recentActivities: UserActivity[]
  monthlyStats: {
    views: number
    saves: number
    inquiries: number
    tours: number
  }
}

export default function AnalyticsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  useEffect(() => {
    if (!isAuthenticated) {
      redirectToAuth(router)
      return
    }
    loadAnalytics()
  }, [isAuthenticated, router, timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
        // Fetch analytics data from dashboard API
      const [activities] = await Promise.all([
        activitiesAPI.getActivities()
      ])

      // Create analytics summary from activities
      const analyticsData: AnalyticsData = {        totalViews: activities.filter((a: UserActivity) => a.activity_type === 'property_view').length,
        totalSaves: activities.filter((a: UserActivity) => a.activity_type === 'property_saved').length,
        totalInquiries: activities.filter((a: UserActivity) => a.activity_type === 'inquiry_sent').length,
        totalTours: activities.filter((a: UserActivity) => a.activity_type === 'tour_scheduled').length,
        recentActivities: activities.slice(0, 10),
        monthlyStats: {          views: activities.filter((a: UserActivity) => 
            a.activity_type === 'property_view' && 
            new Date(a.created_at).getMonth() === new Date().getMonth()
          ).length,
          saves: activities.filter((a: UserActivity) => 
            a.activity_type === 'property_saved' && 
            new Date(a.created_at).getMonth() === new Date().getMonth()
          ).length,
          inquiries: activities.filter((a: UserActivity) => 
            a.activity_type === 'inquiry_sent' && 
            new Date(a.created_at).getMonth() === new Date().getMonth()
          ).length,
          tours: activities.filter((a: UserActivity) => 
            a.activity_type === 'tour_scheduled' && 
            new Date(a.created_at).getMonth() === new Date().getMonth()
          ).length,
        }
      }

      setAnalyticsData(analyticsData)
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Failed to load analytics')
      console.error('Analytics loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'property_view':
        return <Eye className="w-4 h-4 text-blue-600" />
      case 'property_saved':
        return <Star className="w-4 h-4 text-yellow-600" />
      case 'inquiry_sent':
        return <MessageCircle className="w-4 h-4 text-green-600" />
      case 'tour_scheduled':
        return <Calendar className="w-4 h-4 text-purple-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const getActivityLabel = (activityType: string) => {
    switch (activityType) {
      case 'property_view':
        return 'Property View'
      case 'property_saved':
        return 'Property Saved'
      case 'inquiry_sent':
        return 'Inquiry Sent'
      case 'tour_scheduled':
        return 'Tour Scheduled'
      default:
        return activityType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading analytics...</p>
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
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Analytics</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadAnalytics}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!analyticsData) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <p>No analytics data available</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
            <p className="text-gray-600">Track your property engagement and activity</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="7d">Last 7 days </option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <Button variant="outline" className="text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200 shadow-sm hover:shadow-md">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalViews}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +{analyticsData.monthlyStats.views} this month
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Saves</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalSaves}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +{analyticsData.monthlyStats.saves} this month
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalInquiries}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +{analyticsData.monthlyStats.inquiries} this month
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tours</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalTours}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +{analyticsData.monthlyStats.tours} this month
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                {analyticsData.recentActivities.length} activities
              </Badge>
            </div>

            {analyticsData.recentActivities.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                <p className="text-gray-600">Your activity will appear here as you use the platform</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analyticsData.recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.activity_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">
                        {getActivityLabel(activity.activity_type)}
                      </p>                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                    <div className="flex-shrink-0 text-sm text-gray-500">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Engagement Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Property Views</span>
                </div>
                <span className="text-sm text-gray-600">{analyticsData.totalViews}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium">Saved Properties</span>
                </div>
                <span className="text-sm text-gray-600">{analyticsData.totalSaves}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Inquiries Sent</span>
                </div>
                <span className="text-sm text-gray-600">{analyticsData.totalInquiries}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Tours Scheduled</span>
                </div>
                <span className="text-sm text-gray-600">{analyticsData.totalTours}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Views this month</span>
                <span className="text-sm text-gray-600">{analyticsData.monthlyStats.views}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Saves this month</span>
                <span className="text-sm text-gray-600">{analyticsData.monthlyStats.saves}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Inquiries this month</span>
                <span className="text-sm text-gray-600">{analyticsData.monthlyStats.inquiries}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tours this month</span>
                <span className="text-sm text-gray-600">{analyticsData.monthlyStats.tours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
