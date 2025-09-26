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
import { SortSelect } from '../ui/SortFilter';
import type { PageFilterConfig, FilterConfig } from '@/types';

interface ConfigurableFiltersProps {
  config: PageFilterConfig;
  onFiltersChange?: (filters: Record<string, any>) => void;
}

export function ConfigurableFilters({ config, onFiltersChange }: ConfigurableFiltersProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

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
      } else if (filter.type === 'day-range' || filter.type === 'date-range') {
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
        if (!searchParams.has(key)) {
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

  const handleFilterChange = (filterId: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterId]: value }));
  };

  const handleRangeChange = (filterId: string, field: 'gte' | 'lte', value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterId]: { ...prev[filterId], [field]: value }
    }));
  };

  const resetFilters = () => {
    const resetState: Record<string, any> = {};
    config.filters.forEach(filter => {
      if (filter.type === 'multiselect' || filter.type === 'combobox' || filter.type === 'sort') {
        resetState[filter.id] = [];
      } else if (filter.type === 'day-range' || filter.type === 'date-range') {
        resetState[filter.id] = { gte: '', lte: '' };
      } else {
        resetState[filter.id] = '';
      }
    });
    setFilters(resetState);
    
    // Create new URL with only page=1 and existing page_size
    const params = new URLSearchParams();
    params.set('page', '1');
    
    const currentPageSize = searchParams.get('page_size');
    if (currentPageSize) {
      params.set('page_size', currentPageSize);
    }
    
    router.replace(`${pathname}?${params.toString()}`);
    };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    
    // Remove page parameter when applying filters (reset to page 1)
    params.set('page', '1')
    
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
              <span className="text-muted-foreground text-sm">to</span>
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

      case 'date-range':
        return (
          <div key={filter.id} className="space-y-3">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <div className="space-y-2">
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  value={filters[filter.id]?.gte || ''}
                  onChange={(e) => handleRangeChange(filter.id, 'gte', e.target.value)}
                  className="pl-9"
                  placeholder="From date"
                />
              </div>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  value={filters[filter.id]?.lte || ''}
                  onChange={(e) => handleRangeChange(filter.id, 'lte', e.target.value)}
                  className="pl-9"
                  placeholder="To date"
                />
              </div>
            </div>
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
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {config.filters.map(renderFilter)}
      </div>

      <div className="pt-4 border-t space-y-2">
        <Button
          onClick={applyFilters}
          className="w-full"
          size="sm"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}