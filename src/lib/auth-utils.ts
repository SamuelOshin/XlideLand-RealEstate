import { useRouter } from 'next/navigation'

/**
 * Redirects user to authentication page while preserving the intended destination
 * @param router - Next.js router instance
 * @param intendedPath - The path the user was trying to access (optional, defaults to current path)
 * @param authType - 'login' or 'register' (defaults to 'login')
 */
export function redirectToAuth(
  router: any, 
  intendedPath?: string, 
  authType: 'login' | 'register' = 'login'
) {
  // Get current path if not provided
  const redirectPath = intendedPath || window.location.pathname + window.location.search
  
  // Store the intended destination in localStorage
  localStorage.setItem('auth_redirect', encodeURIComponent(redirectPath))
  
  // Redirect to auth page
  router.push(`/auth/${authType}`)
}

/**
 * Checks if user is authenticated, redirects to auth if not
 * @param isAuthenticated - Boolean indicating if user is authenticated
 * @param router - Next.js router instance
 * @param authType - 'login' or 'register' (defaults to 'login')
 * @returns boolean - true if authenticated, false if redirected
 */
export function requireAuth(
  isAuthenticated: boolean, 
  router: any, 
  authType: 'login' | 'register' = 'login'
): boolean {
  if (!isAuthenticated) {
    redirectToAuth(router, undefined, authType)
    return false
  }
  return true
}

/**
 * Hook to get redirect-aware auth functions
 */
export function useAuthRedirect() {
  const router = useRouter()
  
  return {
    redirectToLogin: (intendedPath?: string) => redirectToAuth(router, intendedPath, 'login'),
    redirectToRegister: (intendedPath?: string) => redirectToAuth(router, intendedPath, 'register'),
    requireAuth: (isAuthenticated: boolean, authType: 'login' | 'register' = 'login') => 
      requireAuth(isAuthenticated, router, authType)
  }
}

/**
 * Gets the stored redirect URL and cleans it up
 * @returns string - The redirect URL or '/dashboard' as fallback
 */
export function getRedirectUrl(): string {
  const redirectUrl = localStorage.getItem('auth_redirect') || '/dashboard'
  localStorage.removeItem('auth_redirect') // Clean up
  return decodeURIComponent(redirectUrl)
}

/**
 * Stores a redirect URL for after authentication
 * @param path - The path to redirect to after auth
 */
export function storeRedirectUrl(path: string) {
  localStorage.setItem('auth_redirect', encodeURIComponent(path))
}

/**
 * Hook for components that need to redirect to auth while preserving intended destination
 * This automatically captures the current URL as the intended destination
 */
export function useRequireAuth() {
  const router = useRouter()
  
  return {
    redirectToLogin: () => redirectToAuth(router, undefined, 'login'),
    redirectToRegister: () => redirectToAuth(router, undefined, 'register'),
    redirectToAuthWithPath: (path: string, authType: 'login' | 'register' = 'login') => 
      redirectToAuth(router, path, authType)
  }
}

/**
 * Utility to manually trigger auth redirect from anywhere in the app
 * This preserves the current URL unless a specific path is provided
 */
export function triggerAuthRedirect(authType: 'login' | 'register' = 'login', customPath?: string) {
  const currentPath = customPath || window.location.pathname + window.location.search
  storeRedirectUrl(currentPath)
  window.location.href = `/auth/${authType}`
}
