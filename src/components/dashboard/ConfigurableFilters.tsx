"use client"

import React, { useState, useEffect } from 'react';
import { Search, Calendar, Filter, RotateCcw } from 'lucide-react';
import { usePathname, useRouter } from "@/i18n/navigation"
import { useSearchParams } from "next/navigation"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MultiSelect } from '@/components/ui/multi-select';
import { Combobox } from '@/components/ui/combobox';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SortSelect } from '@/components/ui/SortFilter';
import type { PageFilterConfig, FilterConfig } from '@/types';
import { useTranslations } from 'next-intl';
import { formatDateToUTC7 } from '@/lib/utils/date';

interface ConfigurableFiltersProps {
  config: PageFilterConfig;
  onFiltersChange?: (filters: Record<string, any>) => void;
}

export function ConfigurableFilters({ config, onFiltersChange }: ConfigurableFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations()

  // Initialize filter state from URL params or defaults
  const [filters, setFilters] = useState(() => {
    const initialState: Record<string, any> = {};
    
    config.filters.forEach(filter => {
      const urlValue = searchParams.get(filter.id);
      
      if (urlValue) {
        if (filter.type === 'multiselect' || filter.type === 'combobox' || filter.type === 'sort') {
          initialState[filter.id] = urlValue.split(',');
        } else {
          initialState[filter.id] = urlValue;
        }
      } else if (filter.type === 'day-range' || filter.type === 'date-range' || filter.type === 'month-range') {
        // Check for Django-style range params
        const gteValue = searchParams.get(`${filter.id}__gte`);
        const lteValue = searchParams.get(`${filter.id}__lte`);
        if (gteValue || lteValue) {
          initialState[filter.id] = { gte: gteValue || '', lte: lteValue || '' };
        } else if (config.defaultValues?.[filter.id]) {
          initialState[filter.id] = config.defaultValues[filter.id];
        } else {
          initialState[filter.id] = { gte: '', lte: '' };
        }
      } else if (config.defaultValues?.[filter.id]) {
        initialState[filter.id] = config.defaultValues[filter.id];
      } else {
        // Set default empty values based on filter type
        if (filter.type === 'multiselect' || filter.type === 'combobox' || filter.type === 'sort') {
          initialState[filter.id] = [];
        } else {
          initialState[filter.id] = '';
        }
      }
    });
    
    return initialState;
  });

  // Apply default values to URL on mount if they don't exist
  useEffect(() => {
    if (config.defaultValues) {
      const params = new URLSearchParams(searchParams);
      let hasChanges = false;
      
      Object.entries(config.defaultValues).forEach(([key, value]) => {
        // Check if this is a range object with gte/lte
        if (value && typeof value === 'object' && !Array.isArray(value) && (value.gte || value.lte)) {
          // Handle range objects - check if either __gte or __lte exists in URL
          if (!searchParams.has(`${key}__gte`) && !searchParams.has(`${key}__lte`)) {
            if (value.gte) {
              params.set(`${key}__gte`, value.gte);
              hasChanges = true;
            }
            if (value.lte) {
              params.set(`${key}__lte`, value.lte);
              hasChanges = true;
            }
          }
        } else if (!searchParams.has(key)) {
          if (Array.isArray(value) && value.length > 0) {
            params.set(key, value.join(','));
            hasChanges = true;
          } else if (value && typeof value === 'string') {
            params.set(key, value);
            hasChanges = true;
          }
        }
      });
      
      if (hasChanges) {
        router.replace(`${pathname}?${params.toString()}`);
      }
    }
  }, []);

  // Auto-apply filters when autoApplyFilters is enabled
  useEffect(() => {
    if (config.autoApplyFilters) {
      applyFilters();
    }
  }, [filters, config.autoApplyFilters]);

  const handleFilterChange = (filterId: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterId]: value }));
  };

  const handleRangeChange = (filterId: string, field: 'gte' | 'lte', value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (value === '' || value === null || value === undefined) {
        // Remove the field entirely if value is empty
        if (newFilters[filterId]) {
          const { [field]: _, ...rest } = newFilters[filterId];
          if (Object.keys(rest).length === 0) {
            delete newFilters[filterId];
          } else {
            newFilters[filterId] = rest;
          }
        }
      } else {
        // Set the value
        newFilters[filterId] = { 
          ...newFilters[filterId], 
          [field]: value 
        };
      }
      
      return newFilters;
    });
  };

  const resetFilters = () => {
    const resetState: Record<string, any> = {};
    config.filters.forEach(filter => {
      if (filter.type === 'multiselect' || filter.type === 'combobox' || filter.type === 'sort') {
        resetState[filter.id] = [];
      } else if (filter.type === 'day-range' || filter.type === 'date-range' || filter.type === 'month-range') {
        resetState[filter.id] = { gte: '', lte: '' };
      } else {
        resetState[filter.id] = '';
      }
    });
    setFilters(resetState);
    
    // Create new URL with only page=1 and existing page_size
    const params = new URLSearchParams();
    if (config.isPaginated) {
      params.set('page', '1');
    }
    
    
    const currentPageSize = searchParams.get('page_size');
    if (currentPageSize) {
      params.set('page_size', currentPageSize);
    }
    
    router.replace(`${pathname}?${params.toString()}`);
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    
    // Remove page parameter when applying filters (reset to page 1)
    if (config.isPaginated) {
      params.set('page', '1');
    }
    
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(','));
      } else if (typeof value === 'object' && value !== null && (value.gte || value.lte)) {
        // Handle range filters with Django convention
        if (value.gte) params.set(`${key}__gte`, value.gte);
        else params.delete(`${key}__gte`);
        if (value.lte) params.set(`${key}__lte`, value.lte);
        else params.delete(`${key}__lte`);
        params.delete(key); // Remove the main key for range filters
      } else if (value && typeof value === 'string') {
        params.set(key, value);
      } else {
        // Remove empty values and their related params
        params.delete(key);
        params.delete(`${key}__gte`);
        params.delete(`${key}__lte`);
      }
    });
    
    router.replace(`${pathname}?${params.toString()}`);
    onFiltersChange?.(filters);
  };


  const hasActiveFilters = Object.values(filters).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return value.gte || value.lte;
    return value !== '';
  });

  const renderSelectedBadges = (filterId: string, selectedValues: string[], options: any[]) => {
    if (!selectedValues || selectedValues.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {selectedValues.map((value: string) => {
          const option = options?.find(opt => opt.value === value);
          return (
            <Badge key={value} variant="secondary" className="text-xs">
              {option?.label || value}
            </Badge>
          );
        })}
      </div>
    );
  };

  const renderFilter = (filter: FilterConfig) => {
    switch (filter.type) {
      case 'multiselect':
        return (
          <div key={filter.id} className="space-y-3">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <MultiSelect
              options={filter.options || []}
              onValueChange={(values) => handleFilterChange(filter.id, values)}
              defaultValue={filters[filter.id] || []}
              placeholder={filter.placeholder || `Select ${filter.label.toLowerCase()}...`}
            />
            {renderSelectedBadges(filter.id, filters[filter.id], filter.options || [])}
          </div>
        );

      case 'combobox':
        return (
          <div key={filter.id} className="space-y-3">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <Combobox
              options={filter.options?.map(opt => ({
                value: opt.value,
                label: opt.label,
                searchValue: opt.searchValue || opt.label
              })) || []}
              value={filters[filter.id]}
              onValueChange={(value) => handleFilterChange(filter.id, value)}
              placeholder={filter.placeholder || `Select ${filter.label.toLowerCase()}...`}
              searchPlaceholder={`Search ${filter.label.toLowerCase()}...`}
              emptyMessage={`No ${filter.label.toLowerCase()} found.`}
            />
          </div>
        );

      case 'sort':
        return (
          <div key={filter.id} className="space-y-3">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <SortSelect
              fields={filter.sortFields || []}
              value={filters[filter.id] || []}
              onValueChange={(values) => handleFilterChange(filter.id, values)}
              placeholder={filter.placeholder || "Select sort options..."}
              searchPlaceholder={`Search ${filter.label.toLowerCase()}...`}
              emptyMessage={`No ${filter.label.toLowerCase()} found.`}
            />
          </div>
        );

      case 'select':
        return (
          <div key={filter.id} className="space-y-3">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <Select
              value={filters[filter.id]}
              onValueChange={(value) => handleFilterChange(filter.id, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={filter.placeholder || `Select ${filter.label.toLowerCase()}...`} />
              </SelectTrigger>
              <SelectContent>
                {filter.options?.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'date':
        return (
          <div key={filter.id} className="space-y-3">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="date"
                value={filters[filter.id] || ''}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                className="pl-9"
                placeholder={filter.placeholder || "Select date"}
              />
            </div>
          </div>
        );

      case 'day-range':
        return (
          <div key={filter.id} className="space-y-3">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={filter.min || 1}
                max={filter.max || 31}
                placeholder="From"
                value={filters[filter.id]?.gte || ''}
                onChange={(e) => handleRangeChange(filter.id, 'gte', e.target.value)}
                className="w-20"
              />
              <span className="text-muted-foreground text-sm">{t('common.to')}</span>
              <Input
                type="number"
                min={filter.min || 1}
                max={filter.max || 31}
                placeholder="To"
                value={filters[filter.id]?.lte || ''}
                onChange={(e) => handleRangeChange(filter.id, 'lte', e.target.value)}
                className="w-20"
              />
            </div>
          </div>
        );

      case 'month-range':
        return (
          <div key={filter.id} className="space-y-3">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={filter.min || 1}
                max={filter.max || 12}
                placeholder="From"
                value={filters[filter.id]?.gte || ''}
                onChange={(e) => handleRangeChange(filter.id, 'gte', e.target.value)}
                className="w-20"
              />
              <span className="text-muted-foreground text-sm">to</span>
              <Input
                type="number"
                min={filter.min || 1}
                max={filter.max || 12}
                placeholder="To"
                value={filters[filter.id]?.lte || ''}
                onChange={(e) => handleRangeChange(filter.id, 'lte', e.target.value)}
                className="w-20"
              />
            </div>
          </div>
        );

      case 'date-range':
        return (
          <div key={filter.id} className="space-y-3">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters[filter.id]?.gte && !filters[filter.id]?.lte && "text-muted-foreground"
                  )}
                >
                  <Calendar className="h-2 w-2" />
                  {filters[filter.id]?.gte && filters[filter.id]?.lte ? (
                    <>
                      {formatDateToUTC7(filters[filter.id].gte, 'date')}
                      →
                      {formatDateToUTC7(filters[filter.id].lte, 'date')}
                    </>
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center" side='left'>
                <CalendarComponent
                  key={`${filters[filter.id]?.gte}-${filters[filter.id]?.lte}`}
                  mode="range"
                  defaultMonth={filters[filter.id]?.gte ? new Date(filters[filter.id].gte) : new Date()}
                  selected={{
                    from: filters[filter.id]?.gte ? new Date(filters[filter.id].gte) : undefined,
                    to: filters[filter.id]?.lte ? new Date(filters[filter.id].lte) : undefined,
                  }}
                  onDayClick={(day) => {
                    const currentRange = {
                      from: filters[filter.id]?.gte ? new Date(filters[filter.id].gte) : undefined,
                      to: filters[filter.id]?.lte ? new Date(filters[filter.id].lte) : undefined,
                    };
                    
                    const clickedDate = format(day, 'yyyy-MM-dd');
                    const fromDate = currentRange.from ? format(currentRange.from, 'yyyy-MM-dd') : undefined;
                    
                    // If both are set, start new selection
                    if (currentRange.from && currentRange.to) {
                      handleRangeChange(filter.id, 'gte', clickedDate);
                      handleRangeChange(filter.id, 'lte', '');
                    }
                    // If only 'from' is set
                    else if (currentRange.from && !currentRange.to) {
                      // Clicking same date as 'from' - set as 'to' (allows same-day range)
                      if (clickedDate === fromDate) {
                        handleRangeChange(filter.id, 'lte', clickedDate);
                      }
                      // Clicking before 'from' - reset
                      else if (day < currentRange.from) {
                        handleRangeChange(filter.id, 'gte', clickedDate);
                        handleRangeChange(filter.id, 'lte', '');
                      }
                      // Clicking after 'from' - set as 'to'
                      else {
                        handleRangeChange(filter.id, 'lte', clickedDate);
                      }
                    }
                    // Neither set - set 'from'
                    else {
                      handleRangeChange(filter.id, 'gte', clickedDate);
                    }
                  }}
                  numberOfMonths={1}
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case 'search':
        return (
          <div key={filter.id} className="space-y-3">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={filter.placeholder || 'Search...'}
                value={filters[filter.id]}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object') return value.gte || value.lte;
      return value !== '';
    }).length;
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-medium">Filters</h3>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              {getActiveFilterCount()} active
            </Badge>
          )}
        </div>
        {config.showResetButton !== false && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            {t('common.reset')}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {config.filters.map(renderFilter)}
      </div>
      
      {!config.autoApplyFilters && (
      <div className="pt-4 border-t space-y-2">
        <Button
          onClick={applyFilters}
          className="w-full"
          size="sm"
        >
          {t('common.apply')}
        </Button>
      </div>
      )}
    </div>
  );
}