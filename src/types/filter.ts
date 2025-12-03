export type FilterType = 
  | 'multiselect'
  | 'combobox' 
  | 'day-range' 
  | 'month-range' 
  | 'select' 
  | 'sort' 
  | 'date-range' 
  | 'search'
  | 'date'

export interface FilterOption {
  value: string;
  label: string;
  searchValue?: string;
}

export interface FilterSortFields {
  value: string;
  label: string;
}

export interface FilterConfig {
  id: string;
  type: FilterType;
  label: string;
  placeholder?: string;
  options?: FilterOption[];
  sortFields?: FilterSortFields[];
  searchable?: boolean;
  min?: number;
  max?: number;
  highlightThreshold?: number;
}

export interface PageFilterConfig {
  filters: FilterConfig[];
  // defaultValues?: Record<string, any>;
  showResetButton?: boolean;
  isPaginated?: boolean;
  autoApplyFilters?: boolean;
}

export interface PaginatedResponse<T = any> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PaginationProps {
  totalCount: number;
}

export interface ColumnConfig {
  header: string
  key: string
  transform?: (value: any, row: any) => any
}