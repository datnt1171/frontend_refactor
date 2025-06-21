"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"
import { useDebouncedCallback } from 'use-debounce'

interface SearchInputProps {
  placeholder: string
  defaultValue?: string
}

export function SearchInput({ placeholder, defaultValue = '' }: SearchInputProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    
    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }

    startTransition(() => {
      router.replace(`?${params.toString()}`)
    })
  }, 300)

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="text"
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full"
      />
      <Button type="submit" size="icon" variant="ghost" disabled={isPending}>
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}