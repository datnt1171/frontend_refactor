"use client"

import type * as React from "react"
import { PanelRightClose, PanelRightOpen } from "lucide-react"
import { ConfigurableFilters } from "@/components/dashboard/ConfigurableFilters"
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useRightSidebar } from "@/contexts/FilterContext"
import { useIsMobile } from "@/hooks/use-mobile"
import type { PageFilterConfig } from "@/types"
import { useTranslations } from "next-intl"

interface SidebarRightProps extends React.ComponentProps<typeof Sidebar> {
  filterConfig?: PageFilterConfig;
}

export function SidebarRight({ filterConfig, ...props }: SidebarRightProps) {
  const { isOpen, toggle } = useRightSidebar()
  const isMobile = useIsMobile()
  const t = useTranslations()

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
            </Button>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        {filterConfig ? (
          <ConfigurableFilters config={filterConfig} />
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm">
            {t('dashboard.filter.noFilter')}
          </div>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}