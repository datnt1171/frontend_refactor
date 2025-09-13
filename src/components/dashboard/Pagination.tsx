"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PaginationProps } from "@/types"
import { usePathname, useRouter } from "@/i18n/navigation"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

// Helper function to generate pagination URLs
function createPageURL(pathname: string, searchParams: URLSearchParams, pageNumber: number) {
  const params = new URLSearchParams(searchParams)
  params.set('page', pageNumber.toString())
  return `${pathname}?${params.toString()}`
}

// Helper function to generate page size URL
function createPageSizeURL(pathname: string, searchParams: URLSearchParams, pageSize: number) {
  const params = new URLSearchParams(searchParams)
  params.set('page_size', pageSize.toString())
  params.set('page', '1') // Reset to first page when changing page size
  return `${pathname}?${params.toString()}`
}

// Helper function to generate page numbers array
function generatePagination(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]
  }

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ]
}

export function DataPagination({
  totalCount,
}: PaginationProps) {
  
  const t = useTranslations()
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('page_size')) || 15;
  const totalPages = Math.ceil(totalCount / pageSize)
  const allPages = generatePagination(currentPage, totalPages)

  const PAGE_SIZE_OPTIONS = [
    { value: '15', label: t('dashboard.filter.15perPage') },
    { value: '50', label: t('dashboard.filter.50perPage') },
    { value: '100', label: t('dashboard.filter.100perPage') },
    { value: '999999', label: t('dashboard.filter.showAll') },
  ]

  const handlePageSizeChange = (value: string) => {
    const newUrl = createPageSizeURL(pathname, searchParams, Number(value))
    router.push(newUrl)
  }

  return (
    <div className="flex flex-wrap justify-between items-center gap-2 mt-4 w-full">
      {/* Results info */}
      <div className="hidden sm:block text-sm text-muted-foreground">
        {totalPages <= 1 && totalCount <= pageSize ? 
        (t('dashboard.filter.showingAll', { totalCount })
        ) : (
          t('dashboard.filter.showingRange', {
            start: (currentPage - 1) * pageSize + 1,
            end: Math.min(currentPage * pageSize, totalCount),
            totalCount,
          })
        )
      }
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center">
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href={currentPage <= 1 ? '#' : createPageURL(pathname, searchParams, currentPage - 1)}
                  className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {allPages.map((page, index) => (
                <PaginationItem key={index}>
                  {page === '...' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink 
                      href={createPageURL(pathname, searchParams, Number(page))}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href={currentPage >= totalPages ? '#' : createPageURL(pathname, searchParams, currentPage + 1)}
                  className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Page Size Selector */}
      <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}