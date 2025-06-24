import axios from 'axios'
import {
  User, UserProfile, Property, UserFavorite, Tour, Conversation, Message,
  Notification, PropertyAlert, Document, UserActivity, DashboardStats,
  UserAnalytics, LoginCredentials, RegisterData, TokenResponse, 
  PasswordChangeData, TourCreateData, ConversationCreateData, 
  MessageSendData, PropertyAlertCreateData, Listing
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refresh_token')
        
        if (refreshToken) {
          try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/refresh/`, {
              refresh: refreshToken,
            })
            
            const { access } = response.data
            localStorage.setItem('access_token', access)
            
            return api(original)
          } catch (refreshError) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            window.location.href = '/auth/login'
          }
        }
      }
    }

    return Promise.reject(error)
  }
)

// =================== API METHODS ===================

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    const response = await api.post('/api/accounts/login/', credentials)
    
    // Store tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
    }
    
    return response.data
  },

  register: async (data: RegisterData): Promise<{ user: User; message: string }> => {
    const response = await api.post('/api/accounts/register/', data)
    return response.data
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  },
  getUserProfile: async (): Promise<User> => {
    const response = await api.get('/api/accounts/profile/')
    return response.data
  },
  getUserProfileWithRole: async (): Promise<UserProfile> => {
    // The profiles endpoint returns only current user's profile for non-admin users
    const response = await api.get('/api/accounts/profiles/')
    
    // If it's an array (which it will be), take the first (and only) item
    const profileData = Array.isArray(response.data) ? response.data[0] : response.data.results?.[0] || response.data
    
    if (!profileData) {
      throw new Error('No profile data found')
    }
    
    return profileData
  },

  updateUserProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.patch('/api/accounts/profile/update/', data)
    return response.data
  },

  changePassword: async (data: PasswordChangeData): Promise<{ message: string }> => {
    const response = await api.post('/api/accounts/change-password/', data)
    return response.data
  },
}

export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/api/accounts/dashboard/stats/')
    return response.data
  },

  getAnalytics: async (days: number = 30): Promise<UserAnalytics> => {
    const response = await api.get(`/api/accounts/dashboard/analytics/?days=${days}`)
    return response.data
  },

  getRecentActivities: async (): Promise<UserActivity[]> => {
    const response = await api.get('/api/accounts/activities/')
    return response.data.results
  },

  logActivity: async (activity_type: string, description: string): Promise<{ message: string }> => {
    const response = await api.post('/api/accounts/log-activity/', {
      activity_type,
      description
    })
    return response.data
  },
}

export const userProfileAPI = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/api/accounts/profiles/')
    return response.data.results[0] // Assuming user has one profile
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.patch('/api/accounts/profiles/1/', data) // Assuming profile ID
    return response.data
  },
}

export const favoritesAPI = {
  getFavorites: async (): Promise<UserFavorite[]> => {
    const response = await api.get('/api/accounts/favorites/')
    return response.data.results
  },

  addFavorite: async (property_id: number): Promise<UserFavorite> => {
    const response = await api.post('/api/accounts/favorites/', { property: property_id })
    return response.data
  },

  removeFavorite: async (favoriteId: number): Promise<void> => {
    await api.delete(`/api/accounts/favorites/${favoriteId}/`)
  },
}

export const toursAPI = {
  getTours: async (status?: string): Promise<Tour[]> => {
    const params = status ? `?status=${status}` : ''
    const response = await api.get(`/api/accounts/tours/${params}`)
    return response.data.results
  },

  createTour: async (data: TourCreateData): Promise<Tour> => {
    const response = await api.post('/api/accounts/tours/', data)
    return response.data
  },

  updateTour: async (tourId: number, data: Partial<TourCreateData>): Promise<Tour> => {
    const response = await api.patch(`/api/accounts/tours/${tourId}/`, data)
    return response.data
  },

  cancelTour: async (tourId: number): Promise<{ message: string }> => {
    const response = await api.post(`/api/accounts/tours/${tourId}/cancel/`)
    return response.data
  },
}

export const conversationsAPI = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get('/api/accounts/conversations/')
    return response.data.results
  },

  getConversation: async (conversationId: number): Promise<Conversation> => {
    const response = await api.get(`/api/accounts/conversations/${conversationId}/`)
    return response.data
  },

  getMessages: async (conversationId: number): Promise<Message[]> => {
    const response = await api.get(`/api/accounts/conversations/${conversationId}/messages/`)
    return response.data
  },

  sendMessage: async (conversationId: number, data: MessageSendData): Promise<Message> => {
    const response = await api.post(`/api/accounts/conversations/${conversationId}/send_message/`, data)
    return response.data
  },

  startConversation: async (data: ConversationCreateData): Promise<Conversation> => {
    const response = await api.post('/api/accounts/conversations/start/', data)
    return response.data
  },
}

export const notificationsAPI = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await api.get('/api/accounts/notifications/')
    return response.data.results
  },

  markAsRead: async (notificationId: number): Promise<{ message: string }> => {
    const response = await api.post(`/api/accounts/notifications/${notificationId}/mark_as_read/`)
    return response.data
  },

  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await api.post('/api/accounts/notifications/mark_all_read/')
    return response.data
  },

  deleteNotification: async (notificationId: number): Promise<void> => {
    await api.delete(`/api/accounts/notifications/${notificationId}/`)
  },
}

export const alertsAPI = {
  getAlerts: async (): Promise<PropertyAlert[]> => {
    const response = await api.get('/api/accounts/alerts/')
    return response.data.results
  },
  createAlert: async (data: PropertyAlertCreateData): Promise<PropertyAlert> => {
    const response = await api.post('/api/accounts/alerts/', data)
    return response.data
  },

  updateAlert: async (alertId: number, data: Partial<PropertyAlertCreateData>): Promise<PropertyAlert> => {
    const response = await api.patch(`/api/accounts/alerts/${alertId}/`, data)
    return response.data
  },

  deleteAlert: async (alertId: number): Promise<void> => {
    await api.delete(`/api/accounts/alerts/${alertId}/`)
  },

  toggleAlert: async (alertId: number): Promise<{ message: string; is_active: boolean }> => {
    const response = await api.post(`/api/accounts/alerts/${alertId}/toggle_active/`)
    return response.data
  },
}

export const documentsAPI = {
  getDocuments: async (): Promise<Document[]> => {
    const response = await api.get('/api/accounts/documents/')
    return response.data.results
  },
  uploadDocument: async (file: File, name: string, document_type: string, title?: string): Promise<Document> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('name', name)
    formData.append('document_type', document_type)
    if (title) {
      formData.append('title', title)
    }

    const response = await api.post('/api/accounts/documents/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  deleteDocument: async (documentId: number): Promise<void> => {
    await api.delete(`/api/accounts/documents/${documentId}/`)
  },
}

export const activitiesAPI = {
  getActivities: async (): Promise<UserActivity[]> => {
    const response = await api.get('/api/accounts/activities/')
    return response.data.results
  },
}

export const adminAPI = {
  getUsers: async (search?: string): Promise<User[]> => {
    const params = search ? `?search=${search}` : ''
    const response = await api.get(`/api/accounts/admin/users/${params}`)
    return response.data.results
  },

  toggleUserActive: async (userId: number): Promise<{ message: string; is_active: boolean }> => {
    const response = await api.post(`/api/accounts/admin/users/${userId}/toggle_active/`)
    return response.data
  },

  getUserStats: async (): Promise<any> => {
    const response = await api.get('/api/accounts/admin/users/stats/')
    return response.data
  },
}

export const adminUserAPI = {
  getAllUsers: async (): Promise<{ count: number; results: User[] }> => {
    const response = await api.get('/api/accounts/admin/users/')
    return response.data
  },

  getUserStats: async (): Promise<{
    total_users: number;
    active_users: number;
    inactive_users: number;
    staff_users: number;
    recent_registrations: number;
  }> => {
    const response = await api.get('/api/accounts/admin/users/stats/')
    return response.data
  },

  toggleUserStatus: async (userId: number): Promise<{ message: string; is_active: boolean }> => {
    const response = await api.post(`/api/accounts/admin/users/${userId}/toggle_active/`)
    return response.data
  },

  updateUser: async (userId: number, data: Partial<User>): Promise<User> => {
    const response = await api.patch(`/api/accounts/admin/users/${userId}/`, data)
    return response.data
  },

  deleteUser: async (userId: number): Promise<void> => {
    await api.delete(`/api/accounts/admin/users/${userId}/`)
  },

  createUser: async (data: RegisterData & { role: 'buyer' | 'seller' | 'admin' }): Promise<{ user: User; message: string }> => {
    const response = await api.post('/api/accounts/admin/register/', data)
    return response.data
  },
}

export const utilityAPI = {
  searchUsers: async (query: string): Promise<User[]> => {
    const response = await api.get(`/api/accounts/search-users/?q=${query}`)
    return response.data
  },
}

// =================== LISTINGS/PROPERTIES API ===================

export const listingsAPI = {
  // Get all listings with optional filters
  getListings: async (params?: any): Promise<{ results: Listing[]; count: number }> => {
    const queryParams = new URLSearchParams(params).toString()
    const response = await api.get(`/api/listings/?${queryParams}`)
    return response.data
  },

  // Get featured listings only
  getFeaturedListings: async (): Promise<Listing[]> => {
    const response = await api.get('/api/listings/featured/')
    return response.data.results || response.data
  },

  // Get single listing by ID
  getListing: async (listingId: number): Promise<Listing> => {
    const response = await api.get(`/api/listings/${listingId}/`)
    return response.data
  },

  // Search listings with filters
  searchListings: async (searchParams: any): Promise<{ results: Listing[]; count: number }> => {
    const response = await api.post('/api/listings/search/', searchParams)
    return response.data
  },

  // Create new listing (for realtors/admins)
  createListing: async (data: any): Promise<Listing> => {
    const response = await api.post('/api/listings/', data)
    return response.data
  },

  // Update listing
  updateListing: async (listingId: number, data: any): Promise<Listing> => {
    const response = await api.patch(`/api/listings/${listingId}/`, data)
    return response.data
  },

  // Delete listing
  deleteListing: async (listingId: number): Promise<void> => {
    await api.delete(`/api/listings/${listingId}/`)
  },
}

// Legacy properties API for backward compatibility
export const propertiesAPI = {
  getProperties: async (params?: any): Promise<Property[]> => {
    const queryParams = new URLSearchParams(params).toString()
    const response = await api.get(`/api/listings/?${queryParams}`)
    return response.data.results
  },

  getProperty: async (propertyId: number): Promise<Property> => {
    const response = await api.get(`/api/listings/${propertyId}/`)
    return response.data
  },

  createProperty: async (data: any): Promise<Property> => {
    const response = await api.post('/api/listings/', data)
    return response.data
  },

  updateProperty: async (propertyId: number, data: any): Promise<Property> => {
    const response = await api.patch(`/api/listings/${propertyId}/`, data)
    return response.data
  },

  deleteProperty: async (propertyId: number): Promise<void> => {
    await api.delete(`/api/listings/${propertyId}/`)
  },
}

export default api
