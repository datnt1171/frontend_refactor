// app/[locale]/(platform)/crm/factories/page.tsx
import { getFactories } from '@/lib/api/server/factories'
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"
import { FactoriesFilters } from "./components/factories-filters"
import { FactoriesTable } from "./components/factories-table"
import { Pagination } from "@/components/ui/pagination"

interface SearchParams {
  page?: string
  is_active?: string
  has_onsite?: string
}

export default async function FactoriesPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) {
  const t = await getTranslations()
  const params = await searchParams
  
  // Parse pagination parameters
  const page = parseInt(params.page || '1', 10)
  const limit = 50
  const offset = (page - 1) * limit
  
  // Parse filter parameters
  const isActiveFilter = params.is_active
  const hasOnsiteFilter = params.has_onsite
  
  // Convert string filters to boolean for API
  const apiParams: any = {
    limit,
    offset
  }
  
  if (isActiveFilter && isActiveFilter !== 'all') {
    apiParams.is_active = isActiveFilter === 'true'
  }
  
  if (hasOnsiteFilter && hasOnsiteFilter !== 'all') {
    apiParams.has_onsite = hasOnsiteFilter === 'true'
  }
  
  const response = await getFactories(apiParams)
  
  const factories = response.results
  const totalPages = Math.ceil(response.count / limit)
  const hasNext = !!response.next
  const hasPrevious = !!response.previous
  
  // Create URLSearchParams for maintaining filters in pagination
  const currentParams = new URLSearchParams()
  if (params.is_active) currentParams.set('is_active', params.is_active)
  if (params.has_onsite) currentParams.set('has_onsite', params.has_onsite)
  if (params.page) currentParams.set('page', params.page)

  // Prepare translations
  const tableTranslations = {
    factoryId: t('crm.factories.factoryId'),
    factoryName: t('crm.factories.factoryName'),
    status: t('crm.factories.status'),
    onsite: t('crm.factories.onsite'),
    active: t('common.active'),
    inactive: t('common.inactive'),
    yes: t('common.yes'),
    no: t('common.no'),
    noDataFound: t('common.noDataFound')
  }

  const filterTranslations = {
    active: t('common.active'),
    inactive: t('common.inactive'),
    yes: t('common.yes'),
    no: t('common.no')
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('crm.factories.factories')}</h1>
        <Button>
          {t('crm.factories.addFactory')}
        </Button>
      </div>

      <FactoriesFilters
        isActiveFilter={isActiveFilter}
        hasOnsiteFilter={hasOnsiteFilter}
        currentParams={currentParams}
        translations={filterTranslations}
      />

      <FactoriesTable
        factories={factories}
        count={response.count}
        translations={tableTranslations}
      />
      
      {response.count > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          totalCount={response.count}
          limit={limit}
          currentParams={currentParams}
        />
      )}
    </div>
  )
}