'use client'

import React from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { authAPI } from '@/lib/api'
import { toast } from 'sonner'

interface GoogleSignInButtonProps {
  text?: string
  variant?: 'default' | 'outline'
  className?: string
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" className="mr-2">
    <path
      fill="#4285F4"
      d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"
    />
    <path
      fill="#34A853"
      d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a4.8 4.8 0 0 1-2.7.75c-2.08 0-3.84-1.4-4.48-3.29H1.83v2.07A8 8 0 0 0 8.98 17z"
    />
    <path
      fill="#FBBC05"
      d="M4.5 10.48a4.8 4.8 0 0 1 0-3.04V5.37H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"
    />
    <path
      fill="#EA4335"
      d="M8.98 4.13c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 8.98 1a8 8 0 0 0-7.15 4.37l2.67 2.07c.64-1.9 2.4-3.31 4.48-3.31z"
    />
  </svg>
)

export function GoogleSignInButton({ 
  text = 'Continue with Google',
  variant = 'outline',
  className = ''
}: GoogleSignInButtonProps) {
  const { data: session } = useSession()
  const { refreshUser } = useAuth()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      
      // Use NextAuth to sign in with Google
      const result = await signIn('google', {
        redirect: false, // Don't redirect automatically
      })
      
      if (result?.error) {
        toast.error('Google sign-in failed. Please try again.')
        return
      }
      
      // If successful, the session will be updated automatically
      // We can check for the updated session and handle backend integration
      toast.success('Google sign-in successful!')
      
    } catch (error) {
      console.error('Google sign-in error:', error)
      toast.error('Failed to sign in with Google. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle session changes - integrate with backend when session is available
  React.useEffect(() => {
    const handleSessionChange = async () => {
      if (session?.accessToken && session?.googleProfile) {
        try {
          // Send Google token to our backend for integration
          const response = await authAPI.googleLogin({
            access_token: session.accessToken as string
          })
          
          // Refresh user data in AuthContext
          await refreshUser()
          
          // Redirect to dashboard
          window.location.href = '/dashboard'
          
        } catch (error) {
          console.error('Backend Google OAuth integration error:', error)
          toast.error('Failed to complete sign-in. Please try again.')
        }
      }
    }

    handleSessionChange()
  }, [session])

  return (
    <Button
      type="button"
      variant={variant}
      onClick={handleGoogleSignIn}
      className={`w-full ${className}`}
      disabled={isLoading}
    >
      <GoogleIcon />
      {isLoading ? 'Signing in...' : text}
    </Button>
  )
}

export default GoogleSignInButton