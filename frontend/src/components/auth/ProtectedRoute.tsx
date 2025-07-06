'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useAuthRedirect } from '@/lib/auth-utils'
import { ReactNode, useEffect } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
  requireAuth?: boolean
  authType?: 'login' | 'register'
}

/**
 * Component that protects routes by requiring authentication
 * Automatically redirects to auth page while preserving intended destination
 */
export default function ProtectedRoute({ 
  children, 
  fallback,
  requireAuth = true,
  authType = 'login'
}: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()
  const { requireAuth: checkAuth } = useAuthRedirect()

  useEffect(() => {
    if (!loading && requireAuth) {
      checkAuth(isAuthenticated, authType)
    }
  }, [isAuthenticated, loading, requireAuth, authType, checkAuth])

  // Show loading state
  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">Loading...</span>
          </div>
        </div>
      )
    )
  }

  // If auth is required but user is not authenticated, return null
  // (the useEffect will handle the redirect)
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // Render children if authenticated or auth is not required
  return <>{children}</>
}
