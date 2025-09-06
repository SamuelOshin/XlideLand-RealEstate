/**
 * Google OAuth2 integration utilities for connecting NextAuth sessions with Django backend
 */

import { authAPI } from '@/lib/api'
import { toast } from 'sonner'

export interface GoogleOAuthIntegrationResult {
  success: boolean
  user?: any
  error?: string
  shouldRedirect?: boolean
  redirectUrl?: string
}

export class GoogleOAuthIntegrator {
  /**
   * Handle Google OAuth session and integrate with Django backend
   */
  static async integrateSession(session: any): Promise<GoogleOAuthIntegrationResult> {
    try {
      if (!session?.accessToken || !session?.googleProfile) {
        return {
          success: false,
          error: 'Invalid session data'
        }
      }

      // Attempt to integrate with backend
      const response = await authAPI.googleLogin({
        access_token: session.accessToken
      })

      return {
        success: true,
        user: response.user,
        shouldRedirect: true,
        redirectUrl: '/dashboard'
      }

    } catch (error: any) {
      console.error('Google OAuth integration error:', error)
      
      // Handle specific error types
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Google token verification failed. Please try signing in again.'
        }
      }
      
      if (error.response?.status === 400) {
        return {
          success: false,
          error: error.response.data?.error || 'Invalid Google authentication data.'
        }
      }

      return {
        success: false,
        error: 'Failed to complete Google sign-in. Please try again.'
      }
    }
  }

  /**
   * Show appropriate error message to user
   */
  static handleError(error: string) {
    toast.error(error, {
      duration: 5000,
      action: {
        label: 'Try Again',
        onClick: () => window.location.reload()
      }
    })
  }

  /**
   * Show success message and redirect
   */
  static handleSuccess(redirectUrl: string = '/dashboard') {
    toast.success('Successfully signed in with Google!', {
      duration: 3000
    })
    
    // Small delay to show the toast before redirect
    setTimeout(() => {
      window.location.href = redirectUrl
    }, 1000)
  }

  /**
   * Check if current session needs backend integration
   */
  static needsIntegration(session: any): boolean {
    return !!(
      session?.accessToken && 
      session?.googleProfile && 
      !session?.backendIntegrated
    )
  }
}

/**
 * Hook for handling Google OAuth integration
 */
export function useGoogleOAuthIntegration() {
  const [isIntegrating, setIsIntegrating] = React.useState(false)

  const integrateSession = async (session: any) => {
    if (!GoogleOAuthIntegrator.needsIntegration(session)) {
      return
    }

    setIsIntegrating(true)

    try {
      const result = await GoogleOAuthIntegrator.integrateSession(session)

      if (result.success) {
        GoogleOAuthIntegrator.handleSuccess(result.redirectUrl)
      } else {
        GoogleOAuthIntegrator.handleError(result.error || 'Integration failed')
      }
    } finally {
      setIsIntegrating(false)
    }
  }

  return {
    integrateSession,
    isIntegrating
  }
}

export default GoogleOAuthIntegrator