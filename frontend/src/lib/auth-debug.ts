/**
 * Authentication Debug Utilities
 * Use these functions to debug token and authentication issues
 */

export const authDebug = {
  /**
   * Log current authentication state
   */
  logAuthState: () => {
    if (typeof window === 'undefined') return

    console.group('🔍 Authentication Debug Info')
    
    const accessToken = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')
    const userData = localStorage.getItem('user_data')
    
    console.log('Access Token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'Not found')
    console.log('Refresh Token:', refreshToken ? `${refreshToken.substring(0, 20)}...` : 'Not found')
    console.log('User Data:', userData ? JSON.parse(userData) : 'Not found')
    
    // Check token expiration
    if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]))
        const expiration = new Date(payload.exp * 1000)
        const now = new Date()
        
        console.log('Token Expiration:', expiration.toISOString())
        console.log('Current Time:', now.toISOString())
        console.log('Token Expired:', now > expiration)
        console.log('Time Until Expiration:', Math.round((expiration.getTime() - now.getTime()) / (1000 * 60)), 'minutes')
      } catch (e) {
        console.error('Failed to parse access token:', e)
      }
    }
    
    console.groupEnd()
  },

  /**
   * Clear all authentication data
   */
  clearAuthData: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user_data')
    console.log('🧹 Cleared all authentication data')
  },

  /**
   * Test token refresh manually
   */
  testTokenRefresh: async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      console.error('❌ No refresh token found')
      return
    }

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Token refresh successful:', data)
        localStorage.setItem('access_token', data.access)
        if (data.refresh) {
          localStorage.setItem('refresh_token', data.refresh)
        }
      } else {
        const error = await response.text()
        console.error('❌ Token refresh failed:', response.status, error)
      }
    } catch (error) {
      console.error('❌ Token refresh error:', error)
    }
  },

  /**
   * Test API call with current token
   */
  testApiCall: async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
      const token = localStorage.getItem('access_token')
      
      const response = await fetch(`${API_BASE_URL}/api/accounts/profile/`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ API call successful:', data)
      } else {
        console.error('❌ API call failed:', response.status, await response.text())
      }
    } catch (error) {
      console.error('❌ API call error:', error)
    }
  },
}

// Make it available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).authDebug = authDebug
}
