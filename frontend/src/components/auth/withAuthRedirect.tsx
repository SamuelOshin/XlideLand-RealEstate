'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { redirectToAuth } from '@/lib/auth-utils'
import { useRouter } from 'next/navigation'

/**
 * Higher-Order Component that adds redirect-to-intended-destination logic
 * Use this to wrap components that need authentication
 */
export function withAuthRedirect<P extends object>(
  Component: React.ComponentType<P>,
  authType: 'login' | 'register' = 'login'
) {
  const WrappedComponent = (props: P) => {
    const { isAuthenticated, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        redirectToAuth(router, undefined, authType)
      }
    }, [isAuthenticated, loading, router])

    // Show loading while checking auth
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">Loading...</span>
          </div>
        </div>
      )
    }

    // Don't render if not authenticated (redirect is happening)
    if (!isAuthenticated) {
      return null
    }

    // Render the component if authenticated
    return <Component {...props} />
  }

  // Set display name for better debugging
  WrappedComponent.displayName = `withAuthRedirect(${Component.displayName || Component.name})`

  return WrappedComponent
}

/**
 * Hook for imperatively redirecting to auth with intended destination
 */
export function useAuthRedirectHelper() {
  const router = useRouter()
  
  return {
    redirectToLogin: (intendedPath?: string) => redirectToAuth(router, intendedPath, 'login'),
    redirectToRegister: (intendedPath?: string) => redirectToAuth(router, intendedPath, 'register'),
  }
}
