// src/components/dashboard/filters/CommonFilters.tsx
'use client'

import * as React from "react"
import { useTranslations } from "next-intl"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useFilterContext } from "../FilterContext"

const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i)
const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

export function CommonFilters() {
  const t = useTranslations()
  const { filters, updateCommonFilter } = useFilterContext()

  const handleYearChange = (year: number, checked: boolean) => {
    const newYears = checked 
      ? [...filters.common.years, year]
      : filters.common.years.filter(y => y !== year)
    updateCommonFilter('years', newYears)
  }

  const handleYearSelectAll = (checked: boolean) => {
    updateCommonFilter('years', checked ? YEARS : [])
  }

  const handleMonthChange = (month: number, checked: boolean) => {
    const newMonths = checked 
      ? [...filters.common.months, month]
      : filters.common.months.filter(m => m !== month)
    updateCommonFilter('months', newMonths)
  }

  const handleMonthSelectAll = (checked: boolean) => {
    updateCommonFilter('months', checked ? MONTHS.map(m => m.value) : [])
  }

  const handleDayRangeChange = (field: 'from' | 'to', value: string) => {
    const numValue = Math.max(1, Math.min(31, parseInt(value) || 1))
    updateCommonFilter('dayRange', {
      ...filters.common.dayRange,
      [field]: numValue
    })
  }

  return (
    <div className="space-y-4">
      {/* Year Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            {t('dashboard.filters.common.year')}
          </Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all-years"
              checked={filters.common.years.length === YEARS.length}
              onCheckedChange={handleYearSelectAll}
            />
            <Label htmlFor="select-all-years" className="text-xs">
              {t('dashboard.filters.selectAll')}
            </Label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1 max-h-24 overflow-y-auto">
          {YEARS.map(year => (
            <div key={year} className="flex items-center space-x-2">
              <Checkbox
                id={`year-${year}`}
                checked={filters.common.years.includes(year)}
                onCheckedChange={(checked) => handleYearChange(year, checked as boolean)}
              />
              <Label htmlFor={`year-${year}`} className="text-xs">
                {year}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Month Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            {t('dashboard.filters.common.month')}
          </Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all-months"
              checked={filters.common.months.length === MONTHS.length}
              onCheckedChange={handleMonthSelectAll}
            />
            <Label htmlFor="select-all-months" className="text-xs">
              {t('dashboard.filters.selectAll')}
            </Label>
          </div>
        </div>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {MONTHS.map(month => (
            <div key={month.value} className="flex items-center space-x-2">
              <Checkbox
                id={`month-${month.value}`}
                checked={filters.common.months.includes(month.value)}
                onCheckedChange={(checked) => handleMonthChange(month.value, checked as boolean)}
              />
              <Label htmlFor={`month-${month.value}`} className="text-xs">
                {t(`dashboard.filters.months.${month.label.toLowerCase()}`)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Day Range */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t('dashboard.filters.common.dayRange')}
        </Label>
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <Label htmlFor="day-from" className="text-xs text-muted-foreground">
              {t('dashboard.filters.common.from')}
            </Label>
            <Input
              id="day-from"
              type="number"
              min="1"
              max="31"
              value={filters.common.dayRange.from}
              onChange={(e) => handleDayRangeChange('from', e.target.value)}
              className="mt-1 h-8"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="day-to" className="text-xs text-muted-foreground">
              {t('dashboard.filters.common.to')}
            </Label>
            <Input
              id="day-to"
              type="number"
              min="1"
              max="31"
              value={filters.common.dayRange.to}
              onChange={(e) => handleDayRangeChange('to', e.target.value)}
              className="mt-1 h-8"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Group By */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t('dashboard.filters.common.groupBy')}
        </Label>
        <Select
          value={filters.common.groupBy}
          onValueChange={(value: 'year' | 'quarter' | 'month' | 'day') => 
            updateCommonFilter('groupBy', value)
          }
        >
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="year">
              {t('dashboard.filters.common.groupBy.year')}
            </SelectItem>
            <SelectItem value="quarter">
              {t('dashboard.filters.common.groupBy.quarter')}
            </SelectItem>
            <SelectItem value="month">
              {t('dashboard.filters.common.groupBy.month')}
            </SelectItem>
            <SelectItem value="day">
              {t('dashboard.filters.common.groupBy.day')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Ratio */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t('dashboard.filters.common.ratio')}
        </Label>
        <Select
          value={filters.common.ratio}
          onValueChange={(value: 'stacked' | 'clustered') => 
            updateCommonFilter('ratio', value)
          }
        >
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stacked">
              {t('dashboard.filters.common.ratio.stacked')}
            </SelectItem>
            <SelectItem value="clustered">
              {t('dashboard.filters.common.ratio.clustered')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}