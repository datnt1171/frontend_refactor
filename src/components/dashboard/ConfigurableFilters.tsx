"use client"

import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronDown, X, Filter, RotateCcw } from 'lucide-react';
import { usePathname, useRouter } from "@/i18n/navigation"
import { useSearchParams } from "next/navigation"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
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
        if (filter.type === 'checkbox' || filter.type === 'combobox') {
          initialState[filter.id] = urlValue.split(',');
        } else {
          initialState[filter.id] = urlValue;
        }
      } else if (config.defaultValues?.[filter.id]) {
        initialState[filter.id] = config.defaultValues[filter.id];
      } else {
        // Set default empty values based on filter type
        if (filter.type === 'checkbox' || filter.type === 'combobox') {
          initialState[filter.id] = [];
        } else if (filter.type === 'day-range' || filter.type === 'date-range') {
          initialState[filter.id] = { from: '', to: '' };
        } else {
          initialState[filter.id] = '';
        }
      }
    });
    
    return initialState;
  });

  const [dropdownStates, setDropdownStates] = useState<Record<string, boolean>>({});

  const handleFilterChange = (filterId: string, value: any) => {
    setFilters(prev => ({ ...prev, [filterId]: value }));
  };

  const handleCheckboxChange = (filterId: string, optionValue: string) => {
    setFilters(prev => ({
      ...prev,
      [filterId]: prev[filterId].includes(optionValue)
        ? prev[filterId].filter((item: string) => item !== optionValue)
        : [...prev[filterId], optionValue]
    }));
  };

  const handleRangeChange = (filterId: string, field: 'from' | 'to', value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterId]: { ...prev[filterId], [field]: value }
    }));
  };

  const toggleDropdown = (filterId: string) => {
    setDropdownStates(prev => ({ ...prev, [filterId]: !prev[filterId] }));
  };

  const resetFilters = () => {
    const resetState: Record<string, any> = {};
    config.filters.forEach(filter => {
      if (filter.type === 'checkbox' || filter.type === 'combobox') {
        resetState[filter.id] = [];
      } else if (filter.type === 'day-range' || filter.type === 'date-range') {
        resetState[filter.id] = { from: '', to: '' };
      } else {
        resetState[filter.id] = '';
      }
    });
    setFilters(resetState);
    setDropdownStates({});
    
    if (!config.showApplyButton) {
      // Immediately update URL if no apply button
      router.replace(pathname);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    
    // Remove page parameter when applying filters (reset to page 1)
    params.set('page', '1')
    
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(','));
      } else if (typeof value === 'object' && value.from && value.to) {
        params.set(`${key}_from`, value.from);
        params.set(`${key}_to`, value.to);
      } else if (value && typeof value === 'string') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    router.replace(`${pathname}?${params.toString()}`);
    onFiltersChange?.(filters);
  };

  // Auto-apply filters if showApplyButton is false
  useEffect(() => {
    if (!config.showApplyButton) {
      const timeoutId = setTimeout(applyFilters, 500); // Debounce
      return () => clearTimeout(timeoutId);
    }
  }, [filters, config.showApplyButton]);

  const hasActiveFilters = Object.values(filters).some(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return value.from || value.to;
    return value !== '';
  });

  const renderFilter = (filter: FilterConfig) => {
    switch (filter.type) {
      case 'checkbox':
        return (
          <div key={filter.id} className="space-y-3">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <div className="space-y-2">
              {filter.options?.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${filter.id}-${option.value}`}
                    checked={filters[filter.id]?.includes(option.value)}
                    onCheckedChange={() => handleCheckboxChange(filter.id, option.value)}
                  />
                  <Label 
                    htmlFor={`${filter.id}-${option.value}`} 
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            {filters[filter.id]?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {filters[filter.id].map((value: string) => {
                  const option = filter.options?.find(opt => opt.value === value);
                  return (
                    <span key={value} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center gap-1">
                      {option?.label}
                      <button onClick={() => handleCheckboxChange(filter.id, value)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'combobox':
        return (
          <div key={filter.id} className="space-y-3">
            <Label className="text-sm font-medium">{filter.label}</Label>
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => toggleDropdown(filter.id)}
                className="w-full justify-between"
              >
                {filters[filter.id]?.length > 0 
                  ? `${filters[filter.id].length} selected`
                  : filter.placeholder || `Select ${filter.label.toLowerCase()}...`
                }
                <ChevronDown className="w-4 h-4" />
              </Button>
              
              {dropdownStates[filter.id] && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filter.searchable && (
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder={`Search ${filter.label.toLowerCase()}...`}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  )}
                  {filter.options?.map(option => (
                    <div key={option.value} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                      <Checkbox
                        checked={filters[filter.id]?.includes(option.value)}
                        onCheckedChange={() => handleCheckboxChange(filter.id, option.value)}
                      />
                      <Label className="ml-2 text-sm cursor-pointer">{option.label}</Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {filters[filter.id]?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {filters[filter.id].map((value: string) => {
                  const option = filter.options?.find(opt => opt.value === value);
                  return (
                    <span key={value} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center gap-1">
                      {option?.label}
                      <button onClick={() => handleCheckboxChange(filter.id, value)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
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
                value={filters[filter.id]?.from || ''}
                onChange={(e) => handleRangeChange(filter.id, 'from', e.target.value)}
                className="w-20"
              />
              <span className="text-gray-500 text-sm">to</span>
              <Input
                type="number"
                min={filter.min || 1}
                max={filter.max || 31}
                placeholder="To"
                value={filters[filter.id]?.to || ''}
                onChange={(e) => handleRangeChange(filter.id, 'to', e.target.value)}
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
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="date"
                  value={filters[filter.id]?.from || ''}
                  onChange={(e) => handleRangeChange(filter.id, 'from', e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="date"
                  value={filters[filter.id]?.to || ''}
                  onChange={(e) => handleRangeChange(filter.id, 'to', e.target.value)}
                  className="pl-9"
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
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <h3 className="font-medium">Filters</h3>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        {config.showResetButton !== false && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
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

      {config.showApplyButton && (
        <div className="pt-4 border-t space-y-2">
          <Button
            onClick={applyFilters}
            disabled={!hasActiveFilters}
            className="w-full"
            size="sm"
          >
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  );
}