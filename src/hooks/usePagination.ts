import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import type { PaginatedResponse, PaginationState } from '@/types/';

interface UsePaginationProps {
  defaultPageSize?: number;
  resetOnFilterChange?: boolean;
}

export function usePagination({ 
  defaultPageSize = 10, 
  resetOnFilterChange = true 
}: UsePaginationProps = {}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [paginationState, setPaginationState] = useState<PaginationState>({
    currentPage: Number(searchParams.get('page')) || 1,
    totalPages: 0,
    totalCount: 0,
    pageSize: Number(searchParams.get('page_size')) || defaultPageSize,
    hasNext: false,
    hasPrevious: false,
  });

  // Update pagination state from API response
  const updateFromResponse = useCallback((response: PaginatedResponse) => {
    const totalPages = Math.ceil(response.count / paginationState.pageSize);
    
    setPaginationState(prev => ({
      ...prev,
      totalCount: response.count,
      totalPages,
      hasNext: !!response.next,
      hasPrevious: !!response.previous,
    }));
  }, [paginationState.pageSize]);

  // Navigate to specific page
  const goToPage = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams);
    
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    
    setPaginationState(prev => ({ ...prev, currentPage: page }));
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  // Navigate to next page
  const goToNext = useCallback(() => {
    if (paginationState.hasNext) {
      goToPage(paginationState.currentPage + 1);
    }
  }, [paginationState.hasNext, paginationState.currentPage, goToPage]);

  // Navigate to previous page
  const goToPrevious = useCallback(() => {
    if (paginationState.hasPrevious) {
      goToPage(paginationState.currentPage - 1);
    }
  }, [paginationState.hasPrevious, paginationState.currentPage, goToPage]);

  // Change page size
  const changePageSize = useCallback((newPageSize: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page_size', newPageSize.toString());
    params.delete('page'); // Reset to page 1
    
    setPaginationState(prev => ({
      ...prev,
      pageSize: newPageSize,
      currentPage: 1,
    }));
    
    router.replace(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  // Reset to page 1 (useful when filters change)
  const resetToFirstPage = useCallback(() => {
    if (paginationState.currentPage !== 1) {
      goToPage(1);
    }
  }, [paginationState.currentPage, goToPage]);

  // Listen for filter changes and reset pagination if needed
  useEffect(() => {
    if (resetOnFilterChange) {
      const currentPage = Number(searchParams.get('page')) || 1;
      if (currentPage !== paginationState.currentPage) {
        setPaginationState(prev => ({ ...prev, currentPage }));
      }
    }
  }, [searchParams, resetOnFilterChange, paginationState.currentPage]);

  return {
    ...paginationState,
    goToPage,
    goToNext,
    goToPrevious,
    changePageSize,
    resetToFirstPage,
    updateFromResponse,
  };
}