"use client"

import type * as React from "react"
import { PanelRightClose, PanelRightOpen } from "lucide-react"
import { DashboardFilters } from "@/components/dashboard/DefaultFilters"
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useRightSidebar } from "@/contexts/FilterContext"
import { useIsMobile } from "@/hooks/use-mobile"


export function SidebarRight({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isOpen, toggle } = useRightSidebar()
  const isMobile = useIsMobile()

  if (!isOpen) {
    return (
      <div className="sticky top-0 h-svh w-12 border-l bg-sidebar flex items-start justify-center pt-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="h-8 w-8 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <PanelRightOpen className="h-4 w-4" />
          <span className="sr-only">Open Right Sidebar</span>
        </Button>
      </div>
    )
  }

  return (
    <Sidebar side="right" className="sticky top-0 h-svh border-l" {...props}>
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <div className="flex items-center justify-between">
          {!isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="h-8 w-8 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <PanelRightClose className="h-4 w-4" />
              <span className="sr-only">Close Right Sidebar</span>
            </Button>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <DashboardFilters />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
