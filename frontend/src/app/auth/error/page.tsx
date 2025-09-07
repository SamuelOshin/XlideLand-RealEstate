'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import InstantLoadingLink from '@/components/ui/InstantLoadingLink'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ERROR_MESSAGES = {
  Configuration: 'OAuth configuration error. Please contact support.',
  AccessDenied: 'Access was denied. You can try signing in again.',
  Verification: 'Email verification required. Please verify your email with Google.',
  Default: 'An authentication error occurred. Please try again.',
  Callback: 'Authentication callback failed. Please try signing in again.',
  OAuthSignin: 'Error signing in with Google. Please try again.',
  OAuthCallback: 'Error during Google callback. Please try again.',
  OAuthCreateAccount: 'Could not create account. The email may already be in use.',
  EmailCreateAccount: 'Could not create account with this email.',
  Signin: 'Sign in failed. Please check your credentials.',
  SessionRequired: 'You must be signed in to access this page.',
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  
  const getErrorMessage = (errorType: string | null): string => {
    if (!errorType) return ERROR_MESSAGES.Default
    
    // Handle Google OAuth specific errors
    if (errorType in ERROR_MESSAGES) {
      return ERROR_MESSAGES[errorType as keyof typeof ERROR_MESSAGES]
    }
    
    return ERROR_MESSAGES.Default
  }

  const getErrorTitle = (errorType: string | null): string => {
    switch (errorType) {
      case 'AccessDenied':
        return 'Access Denied'
      case 'Configuration':
        return 'Configuration Error'
      case 'Verification':
        return 'Verification Required'
      case 'OAuthCreateAccount':
        return 'Account Creation Failed'
      default:
        return 'Authentication Error'
    }
  }

  const errorMessage = getErrorMessage(error)
  const errorTitle = getErrorTitle(error)

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>

        {/* Error Title */}
        <h1 className="text-2xl font-bold text-text-primary mb-3">
          {errorTitle}
        </h1>

        {/* Error Message */}
        <p className="text-text-secondary mb-8">
          {errorMessage}
        </p>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="mb-6 p-3 bg-gray-100 rounded-lg">
            <p className="text-xs text-text-muted">
              Error Code: <code className="font-mono">{error}</code>
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Try Again Button */}
          <Button
            onClick={() => window.location.href = '/auth/login'}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Signing In Again
          </Button>

          {/* Home Button */}
          <InstantLoadingLink href="/">
            <Button variant="outline" className="w-full">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </InstantLoadingLink>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-text-muted text-sm">
            Still having trouble?{' '}
            <InstantLoadingLink 
              href="/contact" 
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Contact our support team
            </InstantLoadingLink>
          </p>
        </div>

        {/* Alternative Options */}
        <div className="mt-4">
          <p className="text-text-subtle text-xs">
            You can also try{' '}
            <InstantLoadingLink 
              href="/auth/register" 
              className="text-emerald-600 hover:text-emerald-700"
            >
              creating a new account
            </InstantLoadingLink>
            {' '}or{' '}
            <InstantLoadingLink 
              href="/auth/login" 
              className="text-emerald-600 hover:text-emerald-700"
            >
              using email and password
            </InstantLoadingLink>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-3">
            Loading...
          </h1>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}