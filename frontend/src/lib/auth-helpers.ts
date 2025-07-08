/**
 * Utility functions for handling authentication in Next.js API routes
 */

interface TokenRefreshResponse {
  access: string
  refresh?: string // New refresh token when ROTATE_REFRESH_TOKENS is True
}

/**
 * Get a valid access token, refreshing only if necessary
 */
export async function getValidToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null // Server-side, can't access localStorage
  }

  let accessToken = localStorage.getItem('access_token')
  const refreshToken = localStorage.getItem('refresh_token')

  if (!accessToken || !refreshToken) {
    return null
  }

  // First, try using the current token - don't refresh unless we have to
  return accessToken
}

// Track if a refresh is in progress to avoid multiple simultaneous refreshes
let refreshInProgress = false

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(): Promise<string | null> {
  if (refreshInProgress) {
    console.log('Refresh already in progress, waiting...')
    // Wait a bit and try to get the refreshed token
    await new Promise(resolve => setTimeout(resolve, 1000))
    return localStorage.getItem('access_token')
  }

  const refreshToken = localStorage.getItem('refresh_token')
  
  if (!refreshToken) {
    return null
  }

  refreshInProgress = true

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
    
    console.log('Attempting to refresh token...')
    const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    })

    if (!refreshResponse.ok) {
      console.log('Token refresh failed with status:', refreshResponse.status)
      // Clear invalid tokens
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      return null
    }

    const data: TokenRefreshResponse = await refreshResponse.json()
    localStorage.setItem('access_token', data.access)
    
    // Store new refresh token if provided (when ROTATE_REFRESH_TOKENS is True)
    if (data.refresh) {
      localStorage.setItem('refresh_token', data.refresh)
      console.log('New refresh token stored')
    }
    
    console.log('Token refreshed successfully')
    return data.access
  } catch (error) {
    console.error('Token refresh error:', error)
    // Clear invalid tokens
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    return null
  } finally {
    refreshInProgress = false
  }
}

/**
 * Make an authenticated fetch request with automatic token refresh on 401
 */
export async function authenticatedFetch(
  url: string, 
  options: RequestInit = {}
): Promise<Response> {
  let token = await getValidToken()
  
  if (!token) {
    throw new Error('Authentication failed. Please log in again.')
  }

  // First attempt with current token
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  })

  // If we get a 401, try to refresh the token and retry
  if (response.status === 401) {
    console.log('Got 401, attempting to refresh token...')
    
    token = await refreshAccessToken()
    
    if (!token) {
      throw new Error('Authentication failed. Please log in again.')
    }

    // Retry with new token
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    })
  }

  return response
}
