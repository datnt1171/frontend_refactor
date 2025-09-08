"use client"

import { useState } from "react"
import { Check, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface SortField {
  value: string
  label: string
}

interface SortSelectProps {
  fields: SortField[]
  value?: string[] // Array of sort strings like ["created_at", "-updated_at"]
  onValueChange: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
}

export function SortSelect({
  fields,
  value = [],
  onValueChange,
  placeholder = "Select sort options...",
  searchPlaceholder = "Search fields...",
  emptyMessage = "No fields found.",
  disabled = false,
  className
}: SortSelectProps) {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()

  // Parse current sort state from the value prop (always use latest value)
  const getSortState = () => {
    const state: Record<string, 'asc' | 'desc' | null> = {}
    fields.forEach(field => {
      const ascIndex = value.indexOf(field.value)
      const descIndex = value.indexOf(`-${field.value}`)
      if (ascIndex !== -1) {
        state[field.value] = 'asc'
      } else if (descIndex !== -1) {
        state[field.value] = 'desc'
      } else {
        state[field.value] = null
      }
    })
    return state
  }

  const sortState = getSortState()

  const toggleSort = (fieldValue: string) => {
    const currentState = sortState[fieldValue]
    const newValue = [...value]
    
    // Remove any existing sort for this field
    const ascIndex = newValue.indexOf(fieldValue)
    const descIndex = newValue.indexOf(`-${fieldValue}`)
    if (ascIndex !== -1) newValue.splice(ascIndex, 1)
    if (descIndex !== -1) newValue.splice(descIndex, 1)

    // Add new sort based on current state
    if (currentState === null) {
      // Not sorted -> Ascending
      newValue.push(fieldValue)
    } else if (currentState === 'asc') {
      // Ascending -> Descending
      newValue.push(`-${fieldValue}`)
    }
    // Descending -> Remove (already removed above)

    onValueChange(newValue)
  }

  const getSelectedCount = () => {
    return Object.values(sortState).filter(state => state !== null).length
  }

  const getSortIcon = (state: 'asc' | 'desc' | null) => {
    if (state === 'asc') return <ChevronUp className="w-4 h-4" />
    if (state === 'desc') return <ChevronDown className="w-4 h-4" />
    return null
  }

  const getSortLabel = (state: 'asc' | 'desc' | null) => {
    if (state === 'asc') return 'Ascending'
    if (state === 'desc') return 'Descending'
    return 'Not sorted'
  }

  const renderSelectedBadges = () => {
    const activeSorts = Object.entries(sortState)
      .filter(([_, state]) => state !== null)
      .map(([fieldValue, state]) => {
        const field = fields.find(f => f.value === fieldValue)
        return { field: field!, state: state! }
      })

    if (activeSorts.length === 0) return null

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {activeSorts.map(({ field, state }) => (
          <Badge key={field.value} variant="secondary" className="text-xs flex items-center gap-1">
            {field.label}
            {getSortIcon(state)}
          </Badge>
        ))}
      </div>
    )
  }

  const SortList = () => (
    <Command>
      <CommandInput placeholder={searchPlaceholder} />
      <CommandList>
        <CommandEmpty>{emptyMessage}</CommandEmpty>
        <CommandGroup>
          {fields.map((field) => {
            const state = sortState[field.value] ?? null
            return (
              <CommandItem
                key={field.value}
                value={field.label}
                onSelect={() => toggleSort(field.value)}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <div className={cn(
                      "mr-2 h-4 w-4 border rounded-sm flex items-center justify-center",
                      state !== null ? "bg-primary border-primary text-primary-foreground" : "border-input"
                    )}>
                      {state !== null && <Check className="w-3 h-3" />}
                    </div>
                    <span>{field.label}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>{getSortLabel(state)}</span>
                    {getSortIcon(state)}
                  </div>
                </div>
              </CommandItem>
            )
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  )

  if (isMobile) {
    return (
      <div className={className}>
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between text-xs min-w-0"
              disabled={disabled}
            >
              {getSelectedCount() > 0 ? `${getSelectedCount()} selected` : placeholder}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerTitle className="sr-only">{searchPlaceholder}</DrawerTitle>
            <div className="mt-4 border-t">
              <SortList />
            </div>
          </DrawerContent>
        </Drawer>
        {renderSelectedBadges()}
      </div>
    )
  }

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {getSelectedCount() > 0 ? `${getSelectedCount()} selected` : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start" side="bottom" avoidCollisions={false}>
          <SortList />
        </PopoverContent>
      </Popover>
      {renderSelectedBadges()}
    </div>
  )
}