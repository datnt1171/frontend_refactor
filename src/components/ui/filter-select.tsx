// components/ui/filter-select.tsx
import { Link } from "@/i18n/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FilterSelectProps {
  name: string
  value?: string
  placeholder: string
  options: { value: string; label: string }[]
  currentParams: URLSearchParams
}

export function FilterSelect({ 
  name, 
  value, 
  placeholder, 
  options,
  currentParams 
}: FilterSelectProps) {
  const createFilterUrl = (newValue: string) => {
    const newParams = new URLSearchParams(currentParams)
    if (newValue === 'all') {
      newParams.delete(name)
    } else {
      newParams.set(name, newValue)
    }
    // Reset to page 1 when filtering
    newParams.delete('page')
    return `?${newParams.toString()}`
  }

  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-700">{placeholder}</label>
      <Select value={value || 'all'}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <Link href={createFilterUrl('all')}>
            <SelectItem value="all">All</SelectItem>
          </Link>
          {options.map((option) => (
            <Link key={option.value} href={createFilterUrl(option.value)}>
              <SelectItem value={option.value}>{option.label}</SelectItem>
            </Link>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}