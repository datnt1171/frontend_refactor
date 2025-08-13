"use client"

import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"

export function RightSidebarTrigger() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button variant="ghost" size="icon" className="h-7 w-7 lg:hidden" onClick={toggleSidebar}>
      <Filter className="h-4 w-4" />
      <span className="sr-only">Toggle Dashboard Filters</span>
    </Button>
  )
}
