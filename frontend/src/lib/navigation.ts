/**
 * Navigation utilities for handling redirects and last visited pages
 */

const LAST_VISITED_KEY = 'xlideland_last_visited'
const REDIRECT_KEY = 'xlideland_redirect_after_login'

/**
 * Store the current page as the last visited page
 * Should be called on page load for authenticated pages
 */
export const storeLastVisitedPage = (pathname: string) => {
  if (typeof window === 'undefined') return

  // Don't store auth pages as last visited
  const authPages = ['/auth/login', '/auth/register', '/auth/error']
  if (authPages.some(page => pathname.startsWith(page))) return

  // Don't store API routes or static files
  if (pathname.startsWith('/api') || pathname.includes('.')) return

  try {
    localStorage.setItem(LAST_VISITED_KEY, pathname)
  } catch (error) {
    console.warn('Failed to store last visited page:', error)
  }
}

/**
 * Get the appropriate redirect URL after authentication
 * Priority: 1. Stored redirect URL, 2. Last visited page, 3. Homepage
 */
export const getRedirectUrl = (): string => {
  if (typeof window === 'undefined') return '/'

  try {
    // First priority: Check for stored redirect URL (from protected routes)
    const storedRedirect = localStorage.getItem(REDIRECT_KEY)
    if (storedRedirect) {
      localStorage.removeItem(REDIRECT_KEY) // Clear it after use
      return storedRedirect
    }

    // Second priority: Check for last visited page
    const lastVisited = localStorage.getItem(LAST_VISITED_KEY)
    if (lastVisited && lastVisited !== '/auth/login' && lastVisited !== '/auth/register') {
      return lastVisited
    }

    // Third priority: Homepage as fallback
    return '/'
  } catch (error) {
    console.warn('Failed to get redirect URL:', error)
    return '/'
  }
}

/**
 * Store a specific redirect URL for after authentication
 * Useful for protected routes that redirect to login
 */
export const storeRedirectUrl = (url: string) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(REDIRECT_KEY, url)
  } catch (error) {
    console.warn('Failed to store redirect URL:', error)
  }
}

/**
 * Clear stored redirect URLs
 */
export const clearRedirectUrls = () => {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(LAST_VISITED_KEY)
    localStorage.removeItem(REDIRECT_KEY)
  } catch (error) {
    console.warn('Failed to clear redirect URLs:', error)
  }
}
