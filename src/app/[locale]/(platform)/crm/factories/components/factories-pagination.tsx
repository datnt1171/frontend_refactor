'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface FactoriesPaginationProps {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export function FactoriesPagination({ 
  currentPage, 
  totalPages, 
  hasNext, 
  hasPrevious 
}: FactoriesPaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    return '?' + params.toString()
  }

  const goToPage = (page: number) => {
    router.push(createPageUrl(page))
  }

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPrevious}
          onClick={() => goToPage(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNext}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}