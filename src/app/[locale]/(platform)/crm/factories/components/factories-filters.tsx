'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface FactoriesFiltersProps {
  searchParams: {
    search?: string
    is_active?: string
    has_onsite?: string
    page?: string
    limit?: string
  }
}

export function FactoriesFilters({ searchParams }: FactoriesFiltersProps) {
  const router = useRouter()
  const urlSearchParams = useSearchParams()

  const createFilterUrl = (key: string, value: string) => {
    const params = new URLSearchParams(urlSearchParams.toString())
    
    // Remove page when filtering
    params.delete('page')
    
    // Set or remove the filter
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    return '?' + params.toString()
  }

  const handleSearch = (formData: FormData) => {
    const params = new URLSearchParams(urlSearchParams.toString())
    const search = formData.get('search') as string
    
    params.delete('page') // Reset to first page
    
    if (search) {
      params.set('search', search)
    } else {
      params.delete('search')
    }
    
    router.push('?' + params.toString())
  }

  const clearFilters = () => {
    router.push('?')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters & Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <label htmlFor="search" className="text-sm font-medium">
            Search Factories
          </label>
          <form action={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              name="search"
              placeholder="Search by factory code or name..."
              defaultValue={searchParams.search || ''}
              className="pl-10"
            />
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Active Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              defaultValue={searchParams.is_active || 'all'}
              onValueChange={(value) => {
                router.push(createFilterUrl('is_active', value))
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active Only</SelectItem>
                <SelectItem value="false">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Onsite Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Onsite Availability</label>
            <Select
              defaultValue={searchParams.has_onsite || 'all'}
              onValueChange={(value) => {
                router.push(createFilterUrl('has_onsite', value))
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchParams.search || searchParams.is_active || searchParams.has_onsite) && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear All Filters
          </Button>
        )}
      </CardContent>
    </Card>
  )
}