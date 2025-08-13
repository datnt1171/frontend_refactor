// components/factories/factories-filters.tsx
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { FilterSelect } from "@/components/ui/filter-select"

interface FactoriesFiltersProps {
  isActiveFilter?: string
  hasOnsiteFilter?: string
  currentParams: URLSearchParams
  translations: {
    active: string
    inactive: string
    yes: string
    no: string
  }
}

export function FactoriesFilters({
  isActiveFilter,
  hasOnsiteFilter,
  currentParams,
  translations
}: FactoriesFiltersProps) {
  const hasFilters = isActiveFilter || hasOnsiteFilter

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-end gap-4">
        <FilterSelect
          name="is_active"
          value={isActiveFilter}
          placeholder="Status"
          currentParams={currentParams}
          options={[
            { value: 'true', label: translations.active },
            { value: 'false', label: translations.inactive }
          ]}
        />
        
        <FilterSelect
          name="has_onsite"
          value={hasOnsiteFilter}
          placeholder="Onsite"
          currentParams={currentParams}
          options={[
            { value: 'true', label: translations.yes },
            { value: 'false', label: translations.no }
          ]}
        />
        
        {/* Clear Filters Button */}
        {hasFilters && (
          <Link href="/crm/factories">
            <Button variant="outline" size="sm">
              Clear Filters
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}