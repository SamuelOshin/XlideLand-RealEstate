'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { alertsAPI, notificationsAPI } from '@/lib/api'
import { PropertyAlert, Notification } from '@/types'
import { redirectToAuth } from '@/lib/auth-utils'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  BellRing,
  Settings,
  Search,
  Filter,
  TrendingDown,
  Home,
  MapPin,
  DollarSign,
  Calendar,
  Star,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'

export default function AlertsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [propertyAlerts, setPropertyAlerts] = useState<PropertyAlert[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'notifications' | 'alerts'>('notifications')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [showCreateAlert, setShowCreateAlert] = useState(false)
  useEffect(() => {
    if (!isAuthenticated) {
      redirectToAuth(router)
      return
    }
    loadData()
  }, [isAuthenticated, router])
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [alertsData, notificationsData] = await Promise.all([
        alertsAPI.getAlerts(),
        notificationsAPI.getNotifications()
      ])
      setPropertyAlerts(alertsData)
      setNotifications(notificationsData)
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Failed to load alerts and notifications')
      console.error('Alerts loading error:', error)
    } finally {
      setLoading(false)
    }
  }

  const markNotificationAsRead = async (notificationId: number) => {
    try {
      await notificationsAPI.markAsRead(notificationId)
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      )
    } catch (err) {
      console.error('Mark as read error:', err)
      toast.error('Failed to mark notification as read')
    }
  }

  const deleteAlert = async (alertId: number) => {
    try {
      await alertsAPI.deleteAlert(alertId)
      setPropertyAlerts(prev => prev.filter(alert => alert.id !== alertId))
      toast.success('Alert deleted successfully')
    } catch (err) {
      console.error('Delete alert error:', err)
      toast.error('Failed to delete alert')
    }
  }

  const deleteNotification = async (notificationId: number) => {
    try {
      await notificationsAPI.deleteNotification(notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      toast.success('Notification deleted')
    } catch (err) {
      console.error('Delete notification error:', err)
      toast.error('Failed to delete notification')
    }
  }

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter(n => !n.is_read)
          .map(n => notificationsAPI.markAsRead(n.id))
      )
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      )
      toast.success('All notifications marked as read')
    } catch (err) {
      console.error('Mark all as read error:', err)
      toast.error('Failed to mark all notifications as read')
    }
  }

  const filteredNotifications = notifications
    .filter(notification => {
      if (!searchQuery) return true
      const searchLower = searchQuery.toLowerCase()
      return (
        notification.title.toLowerCase().includes(searchLower) ||
        notification.message.toLowerCase().includes(searchLower)
      )
    })
    .filter(notification => {
      if (filterType === 'all') return true
      if (filterType === 'unread') return !notification.is_read
      if (filterType === 'read') return notification.is_read
      return true
    })
  const filteredAlerts = propertyAlerts
    .filter(alert => {
      if (!searchQuery) return true
      const searchLower = searchQuery.toLowerCase()
      return (
        alert.name.toLowerCase().includes(searchLower) ||
        alert.location.toLowerCase().includes(searchLower) ||
        alert.property_type.toLowerCase().includes(searchLower)
      )
    })
    .filter(alert => {
      if (filterType === 'all') return true
      if (filterType === 'active') return alert.is_active
      if (filterType === 'inactive') return !alert.is_active
      return true
    })

  const unreadCount = notifications.filter(notification => !notification.is_read).length

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading alerts and notifications...</p>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadData}
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
            <h1 className="text-2xl font-bold text-gray-900">Alerts & Notifications</h1>
            <p className="text-gray-600">Stay updated with important notifications and manage your alert preferences</p>
          </div>
          <div className="flex items-center gap-4">
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {unreadCount} unread
              </Badge>
            )}
            <Button
              variant="outline"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'notifications'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Bell className="w-4 h-4 inline mr-2" />
                Notifications ({notifications.length})
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'alerts'
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Property Alerts ({propertyAlerts.length})
              </button>
            </nav>
          </div>

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="p-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Notifications</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>

              {/* Notifications List */}
              <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
                    <p className="text-gray-600">
                      {searchQuery || filterType !== 'all' 
                        ? 'Try adjusting your search or filter criteria' 
                        : 'You\'re all caught up! New notifications will appear here.'
                      }
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`bg-white rounded-lg border shadow-sm p-4 hover:shadow-md transition-shadow ${
                        !notification.is_read ? 'border-l-4 border-l-emerald-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Bell className="w-4 h-4 text-emerald-600" />
                            <h3 className="font-medium text-gray-900">{notification.title}</h3>
                            {!notification.is_read && (
                              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(notification.created_at).toLocaleDateString()} at {' '}
                            {new Date(notification.created_at).toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {!notification.is_read && (
                            <button
                              onClick={() => markNotificationAsRead(notification.id)}
                              className="text-emerald-600 hover:text-emerald-700 p-1"
                              title="Mark as read"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Property Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="p-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search property alerts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Alerts</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <Button
                  onClick={() => setShowCreateAlert(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Alert
                </Button>
              </div>

              {/* Property Alerts List */}
              <div className="space-y-4">
                {filteredAlerts.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No property alerts found</h3>
                    <p className="text-gray-600">
                      {searchQuery || filterType !== 'all' 
                        ? 'Try adjusting your search or filter criteria' 
                        : 'Create your first property alert to get notified about matching properties.'
                      }
                    </p>
                  </div>
                ) : (
                  filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`bg-white rounded-lg border shadow-sm p-4 hover:shadow-md transition-shadow ${
                        alert.is_active ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Home className="w-4 h-4 text-emerald-600" />
                            <h3 className="font-medium text-gray-900">{alert.name}</h3>
                            <Badge 
                              variant="secondary" 
                              className={alert.is_active 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-gray-100 text-gray-800'
                              }
                            >
                              {alert.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">
                            {alert.location} • {alert.property_type}
                            {alert.min_price && ` • $${alert.min_price.toLocaleString()}+`}
                            {alert.max_price && ` • Under $${alert.max_price.toLocaleString()}`}
                            {alert.min_bedrooms && ` • ${alert.min_bedrooms}+ beds`}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            Created {new Date(alert.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => deleteAlert(alert.id)}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Delete alert"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
