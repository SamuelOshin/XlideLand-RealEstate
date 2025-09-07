'use client'

import React from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { getRedirectUrl } from '@/lib/navigation'
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
  const [isLoading, setIsLoading] = React.useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)

      // Get the appropriate redirect URL (last visited or homepage)
      const redirectUrl = getRedirectUrl()

      // Use NextAuth to sign in with Google - let it handle the redirect
      const result = await signIn('google', {
        callbackUrl: redirectUrl, // Redirect to last visited page or homepage
        redirect: false, // Don't redirect automatically, handle it manually
      })

      if (result?.error) {
        console.error('Sign in error:', result.error)
        toast.error('Failed to sign in with Google. Please try again.')
        setIsLoading(false)
      } else if (result?.url) {
        // Redirect to Google OAuth page
        window.location.href = result.url
      } else {
        // The redirect will happen automatically
      }

    } catch (error) {
      console.error('Google sign-in error:', error)
      toast.error('Failed to sign in with Google. Please try again.')
      setIsLoading(false)
    }
  }

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