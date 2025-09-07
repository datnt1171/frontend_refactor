export type FilterType = 
  | 'checkbox' 
  | 'combobox' 
  | 'day-range' 
  | 'select' 
  | 'sort' 
  | 'date-range' 
  | 'search'

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  id: string;
  type: FilterType;
  label: string;
  placeholder?: string;
  options?: FilterOption[];
  multiple?: boolean;
  searchable?: boolean;
  min?: number;
  max?: number;
}

export interface PageFilterConfig {
  filters: FilterConfig[];
  defaultValues?: Record<string, any>;
  showApplyButton?: boolean;
  showResetButton?: boolean;
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