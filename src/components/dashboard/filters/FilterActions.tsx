// src/components/dashboard/filters/FilterActions.tsx
'use client'

import * as React from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { useFilterContext } from "../FilterContext"

export function FilterActions() {
  const t = useTranslations()
  const { applyFilters, resetFilters } = useFilterContext()

  return (
    <div className="space-y-2">
      <Button 
        onClick={applyFilters} 
        className="w-full"
        size="sm"
      >
        {t('dashboard.filters.actions.apply')}
      </Button>
      
      <Button 
        onClick={resetFilters} 
        variant="outline" 
        className="w-full"
        size="sm"
      >
        {t('dashboard.filters.actions.reset')}
      </Button>
    </div>
  )
}