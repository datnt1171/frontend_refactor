// components/ui/pagination.tsx
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  totalCount: number
  limit: number
  currentParams: URLSearchParams
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  hasNext, 
  hasPrevious,
  totalCount,
  limit,
  currentParams
}: PaginationProps) {
  const startItem = (currentPage - 1) * limit + 1
  const endItem = Math.min(currentPage * limit, totalCount)

  const createPageUrl = (pageNum: number) => {
    const newParams = new URLSearchParams(currentParams)
    if (pageNum === 1) {
      newParams.delete('page')
    } else {
      newParams.set('page', pageNum.toString())
    }
    return `?${newParams.toString()}`
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalCount} entries
      </div>
      <div className="flex items-center space-x-2">
        <Link 
          href={createPageUrl(currentPage - 1)}
          className={hasPrevious ? "" : "pointer-events-none"}
        >
          <Button 
            variant="outline" 
            size="sm" 
            disabled={!hasPrevious}
          >
            Previous
          </Button>
        </Link>
        
        <div className="flex items-center space-x-1">
          {/* Show page numbers */}
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }
            
            return (
              <Link key={pageNum} href={createPageUrl(pageNum)}>
                <Button
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              </Link>
            )
          })}
        </div>

        <Link 
          href={createPageUrl(currentPage + 1)}
          className={hasNext ? "" : "pointer-events-none"}
        >
          <Button 
            variant="outline" 
            size="sm" 
            disabled={!hasNext}
          >
            Next
          </Button>
        </Link>
      </div>
    </div>
  )
}