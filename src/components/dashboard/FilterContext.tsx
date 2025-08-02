// src/components/dashboard/FilterContext.tsx
'use client'

import * as React from "react"

export interface CommonFilters {
  years: number[]
  months: number[]
  dayRange: { from: number; to: number }
  groupBy: 'year' | 'quarter' | 'month' | 'day'
  ratio: 'stacked' | 'clustered'
}

export interface PageSpecificFilters {
  dateRange?: { from: Date; to: Date }
  multipleSelect?: string[]
  monthYear?: string // mm/yyyy format
}

export interface FilterState {
  common: CommonFilters
  specific: PageSpecificFilters
}

interface FilterContextType {
  filters: FilterState
  updateCommonFilter: <K extends keyof CommonFilters>(
    key: K,
    value: CommonFilters[K]
  ) => void
  updateSpecificFilter: <K extends keyof PageSpecificFilters>(
    key: K,
    value: PageSpecificFilters[K]
  ) => void
  resetFilters: () => void
  applyFilters: () => void
}

const FilterContext = React.createContext<FilterContextType | undefined>(undefined)

const defaultFilters: FilterState = {
  common: {
    years: [],
    months: [],
    dayRange: { from: 1, to: 31 },
    groupBy: 'month',
    ratio: 'stacked',
  },
  specific: {},
}

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = React.useState<FilterState>(defaultFilters)

  const updateCommonFilter = React.useCallback(
    <K extends keyof CommonFilters>(key: K, value: CommonFilters[K]) => {
      setFilters(prev => ({
        ...prev,
        common: { ...prev.common, [key]: value }
      }))
    },
    []
  )

  const updateSpecificFilter = React.useCallback(
    <K extends keyof PageSpecificFilters>(key: K, value: PageSpecificFilters[K]) => {
      setFilters(prev => ({
        ...prev,
        specific: { ...prev.specific, [key]: value }
      }))
    },
    []
  )

  const resetFilters = React.useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  const applyFilters = React.useCallback(() => {
    // Here you would typically trigger the actual filtering logic
    // This could involve updating URL params, calling APIs, etc.
    console.log('Applying filters:', filters)
  }, [filters])

  const value = React.useMemo(
    () => ({
      filters,
      updateCommonFilter,
      updateSpecificFilter,
      resetFilters,
      applyFilters,
    }),
    [filters, updateCommonFilter, updateSpecificFilter, resetFilters, applyFilters]
  )

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilterContext() {
  const context = React.useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilterContext must be used within a FilterProvider')
  }
  return context
}