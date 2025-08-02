'use client'

import * as React from "react"
import { useTranslations } from "next-intl"
import { Calendar } from "lucide-react"
import { format } from "date-fns"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFilterContext } from "../FilterContext"

interface PageSpecificFiltersProps {
  pathname: string
}

// Define which additional filters each page needs
const getPageFilters = (pathname: string) => {
  if (pathname.includes('/task-management/sample-request')) {
    return ['dateRange', 'multipleSelect']
  }
  if (pathname.includes('/warehouse/aging')) {
    return ['monthYear', 'multipleSelect']
  }
  if (pathname.includes('/warehouse/compare')) {
    return ['dateRange', 'monthYear']
  }
  return []
}

// Sample options for multiple select - in real app, these would come from API
const SAMPLE_OPTIONS = [
  'Option A',
  'Option B', 
  'Option C',
  'Option D',
  'Option E'
]

export function PageSpecificFilters({ pathname }: PageSpecificFiltersProps) {
  const t = useTranslations()
  const { filters, updateSpecificFilter } = useFilterContext()
  const pageFilters = getPageFilters(pathname)

  if (pageFilters.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        {t('dashboard.filters.specific.noFilters')}
      </div>
    )
  }

  const handleDateRangeChange = (field: 'from' | 'to', date: Date | undefined) => {
    const currentRange = filters.specific.dateRange || { from: new Date(), to: new Date() }
    updateSpecificFilter('dateRange', {
      ...currentRange,
      [field]: date || new Date()
    })
  }

  const handleMultipleSelectChange = (option: string, checked: boolean) => {
    const current = filters.specific.multipleSelect || []
    const updated = checked 
      ? [...current, option]
      : current.filter(item => item !== option)
    updateSpecificFilter('multipleSelect', updated)
  }

  const handleMonthYearChange = (value: string) => {
    updateSpecificFilter('monthYear', value)
  }

  // Generate month/year options for the last 24 months
  const generateMonthYearOptions = () => {
    const options = []
    const currentDate = new Date()
    
    for (let i = 0; i < 24; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      options.push(`${month}/${year}`)
    }
    
    return options
  }

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      {pageFilters.includes('dateRange') && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            {t('dashboard.filters.specific.dateRange')}
          </Label>
          <div className="space-y-2">
            <div>
              <Label htmlFor="date-from" className="text-xs text-muted-foreground">
                {t('dashboard.filters.specific.dateFrom')}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mt-1"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filters.specific.dateRange?.from ? (
                      format(filters.specific.dateRange.from, "PPP")
                    ) : (
                      t('dashboard.filters.specific.pickDate')
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  {/* Note: In real implementation, you'd use a proper Calendar component */}
                  <div className="p-3">
                    <Input
                      type="date"
                      onChange={(e) => handleDateRangeChange('from', new Date(e.target.value))}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="date-to" className="text-xs text-muted-foreground">
                {t('dashboard.filters.specific.dateTo')}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal mt-1"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filters.specific.dateRange?.to ? (
                      format(filters.specific.dateRange.to, "PPP")
                    ) : (
                      t('dashboard.filters.specific.pickDate')
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="p-3">
                    <Input
                      type="date"
                      onChange={(e) => handleDateRangeChange('to', new Date(e.target.value))}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}

      {/* Multiple Select Filter */}
      {pageFilters.includes('multipleSelect') && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            {t('dashboard.filters.specific.multipleSelect')}
          </Label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {SAMPLE_OPTIONS.map(option => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`option-${option}`}
                  checked={filters.specific.multipleSelect?.includes(option) || false}
                  onCheckedChange={(checked) => 
                    handleMultipleSelectChange(option, checked as boolean)
                  }
                />
                <Label htmlFor={`option-${option}`} className="text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Month/Year Select Filter */}
      {pageFilters.includes('monthYear') && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            {t('dashboard.filters.specific.monthYear')}
          </Label>
          <Select
            value={filters.specific.monthYear || ''}
            onValueChange={handleMonthYearChange}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('dashboard.filters.specific.selectMonthYear')} />
            </SelectTrigger>
            <SelectContent>
              {generateMonthYearOptions().map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}