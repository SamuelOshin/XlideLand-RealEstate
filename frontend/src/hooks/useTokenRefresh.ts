/**
 * Proactive Token Refresh Hook
 * Automatically refreshes tokens before they expire
 */
import { useEffect, useRef } from 'react'
import { authAPI } from '@/lib/api'

export function useTokenRefresh() {
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const scheduleTokenRefresh = () => {
    // Clear existing timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
    }

    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) return

    try {
      // Parse token to get expiration
      const payload = JSON.parse(atob(accessToken.split('.')[1]))
      const expiration = new Date(payload.exp * 1000)
      const now = new Date()
      
      // Refresh 5 minutes before expiration
      const refreshTime = expiration.getTime() - now.getTime() - (5 * 60 * 1000)
      
      if (refreshTime > 0) {
        console.log(`🔄 Scheduling token refresh in ${Math.round(refreshTime / (1000 * 60))} minutes`)
        
        refreshTimeoutRef.current = setTimeout(async () => {
          try {
            console.log('🔄 Proactively refreshing token...')
            await authAPI.refreshToken()
            console.log('✅ Proactive token refresh successful')
            
            // Schedule the next refresh
            scheduleTokenRefresh()
          } catch (error) {
            console.error('❌ Proactive token refresh failed:', error)
          }
        }, refreshTime)
      }
    } catch (error) {
      console.error('Failed to parse access token for refresh scheduling:', error)
    }
  }

  useEffect(() => {
    scheduleTokenRefresh()

    // Listen for token updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' && e.newValue) {
        scheduleTokenRefresh()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])
}
