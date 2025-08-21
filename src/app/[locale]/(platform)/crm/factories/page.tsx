import { Building2 } from 'lucide-react'
import { getFactories } from '@/lib/api/server'
import { FactoriesTable } from './components/factories-table'
import { FactoriesFilters } from './components/factories-filters'
import { FactoriesPagination } from './components/factories-pagination'

interface PageProps {
  searchParams: Promise<{
    search?: string
    is_active?: string
    has_onsite?: string
    page?: string
    limit?: string
  }>
}

async function FactoriesContent({ searchParams }: { searchParams: PageProps['searchParams'] }) {
  const params = await searchParams
  const currentPage = parseInt(params.page || '1')
  const limit = parseInt(params.limit || '50')
  const offset = (currentPage - 1) * limit

  // Build API parameters
  const apiParams: Parameters<typeof getFactories>[0] = {
    offset,
    limit,
  }

  if (params.is_active !== undefined) {
    apiParams.is_active = params.is_active === 'true'
  }

  if (params.has_onsite !== undefined) {
    apiParams.has_onsite = params.has_onsite === 'true'
  }

  const factories = await getFactories(apiParams)
  
  // Filter results client-side if search is provided
  let filteredResults = factories.results
  if (params.search) {
    const searchTerm = params.search.toLowerCase()
    filteredResults = factories.results.filter(
      (factory) =>
        factory.factory_code.toLowerCase().includes(searchTerm) ||
        factory.factory_name.toLowerCase().includes(searchTerm)
    )
  }

  const filteredFactories = {
    ...factories,
    results: filteredResults,
    count: params.search ? filteredResults.length : factories.count,
  }

  const totalPages = Math.ceil(factories.count / limit)
  const hasNext = !!factories.next
  const hasPrevious = !!factories.previous

  return (
    <div className="space-y-6">
      <FactoriesFilters searchParams={params} />
      <FactoriesTable 
        factories={filteredFactories}
        currentPage={currentPage}
        limit={limit}
        totalPages={totalPages}
      />
      <FactoriesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
      />
    </div>
  )
} 


export default async function FactoriesPage({ searchParams }: PageProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Building2 className="h-8 w-8" />
          Factories
        </h1>
        <p className="text-gray-600 mt-2">
          Manage and view all factory locations
        </p>
      </div>

      <FactoriesContent searchParams={searchParams} />
    </div>
  )
}