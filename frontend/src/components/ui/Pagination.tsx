'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  has_next: boolean;
  has_previous: boolean;
  next_page: number | null;
  previous_page: number | null;
}

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  showPageNumbers?: boolean;
  showInfo?: boolean;
  maxVisiblePages?: number;
  loading?: boolean;
  className?: string;
  compact?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onNext,
  onPrevious,
  showPageNumbers = true,
  showInfo = true,
  maxVisiblePages = 5,
  loading = false,
  className = '',
  compact = false,
}) => {
  const { page, limit, total, pages, has_next, has_previous } = pagination;

  // Generate page numbers to show
  const getVisiblePages = () => {
    if (pages <= maxVisiblePages) {
      return Array.from({ length: pages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, page - half);
    let end = Math.min(pages, start + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  if (pages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  // Compact version for mobile/small spaces
  if (compact) {
    return (
      <div className={`flex items-center justify-between space-x-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={!has_previous || loading}
          className="flex items-center space-x-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Page {page} of {pages}</span>
          {showInfo && (
            <span className="hidden sm:inline">
              • {total} total
            </span>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!has_next || loading}
          className="flex items-center space-x-1"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Results info */}
      {showInfo && (
        <div className="text-sm text-gray-600">
          Showing {Math.min((page - 1) * limit + 1, total)} to {Math.min(page * limit, total)} of {total} results
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-center space-x-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={!has_previous || loading}
          className="flex items-center space-x-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Page Numbers */}
        {showPageNumbers && (
          <div className="flex items-center space-x-1">
            {/* First page */}
            {visiblePages[0] > 1 && (
              <>
                <Button
                  variant={1 === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(1)}
                  disabled={loading}
                  className="w-10 h-9"
                >
                  1
                </Button>
                {visiblePages[0] > 2 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
              </>
            )}

            {/* Visible page numbers */}
            {visiblePages.map((pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                disabled={loading}
                className="w-10 h-9"
              >
                {pageNum}
              </Button>
            ))}

            {/* Last page */}
            {visiblePages[visiblePages.length - 1] < pages && (
              <>
                {visiblePages[visiblePages.length - 1] < pages - 1 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
                <Button
                  variant={pages === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pages)}
                  disabled={loading}
                  className="w-10 h-9"
                >
                  {pages}
                </Button>
              </>
            )}
          </div>
        )}

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!has_next || loading}
          className="flex items-center space-x-1"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile-friendly view */}
      <div className="flex sm:hidden items-center justify-between w-full max-w-xs">
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={!has_previous || loading}
          className="flex items-center space-x-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Prev</span>
        </Button>

        <div className="text-sm text-gray-600">
          {page} / {pages}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!has_next || loading}
          className="flex items-center space-x-1"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
