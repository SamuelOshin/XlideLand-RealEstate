import { useState, useCallback } from 'react'

interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
  has_next: boolean
  has_previous: boolean
  next_page: number | null
  previous_page: number | null
}

interface UsePaginationOptions {
  initialPage?: number
  initialLimit?: number
  onPageChange?: (page: number, limit: number) => void
}

interface UsePaginationReturn {
  page: number
  limit: number
  pagination: PaginationInfo | null
  setPagination: (pagination: PaginationInfo | null) => void
  goToPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  setLimit: (limit: number) => void
  reset: () => void
}

/**
 * Custom hook for managing pagination state
 * Provides all the necessary functions and state for pagination
 */
export const usePagination = (options: UsePaginationOptions = {}): UsePaginationReturn => {
  const {
    initialPage = 1,
    initialLimit = 12,
    onPageChange
  } = options

  const [page, setPage] = useState(initialPage)
  const [limit, setLimitState] = useState(initialLimit)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)

  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && (pagination?.pages === undefined || newPage <= pagination.pages)) {
      setPage(newPage)
      onPageChange?.(newPage, limit)
    }
  }, [pagination?.pages, limit, onPageChange])

  const nextPage = useCallback(() => {
    if (pagination?.has_next) {
      goToPage(page + 1)
    }
  }, [pagination?.has_next, page, goToPage])

  const previousPage = useCallback(() => {
    if (pagination?.has_previous) {
      goToPage(page - 1)
    }
  }, [pagination?.has_previous, page, goToPage])

  const setLimit = useCallback((newLimit: number) => {
    setLimitState(newLimit)
    // Reset to first page when changing limit
    setPage(1)
    onPageChange?.(1, newLimit)
  }, [onPageChange])

  const reset = useCallback(() => {
    setPage(initialPage)
    setLimitState(initialLimit)
    setPagination(null)
  }, [initialPage, initialLimit])

  return {
    page,
    limit,
    pagination,
    setPagination,
    goToPage,
    nextPage,
    previousPage,
    setLimit,
    reset
  }
}

/**
 * Helper function to create pagination query parameters
 */
export const createPaginationParams = (page: number, limit: number, additionalParams: Record<string, any> = {}) => {
  return {
    page,
    limit,
    ...additionalParams
  }
}

/**
 * Helper function to validate pagination response
 */
export const validatePaginationResponse = (response: any): response is { results: any[]; count: number; pagination?: PaginationInfo } => {
  return (
    response &&
    typeof response === 'object' &&
    Array.isArray(response.results) &&
    typeof response.count === 'number'
  )
}

/**
 * Helper function to create pagination info from response
 */
export const createPaginationInfo = (
  page: number,
  limit: number,
  total: number
): PaginationInfo => {
  const pages = Math.ceil(total / limit)
  
  return {
    page,
    limit,
    total,
    pages,
    has_next: page < pages,
    has_previous: page > 1,
    next_page: page < pages ? page + 1 : null,
    previous_page: page > 1 ? page - 1 : null
  }
}
