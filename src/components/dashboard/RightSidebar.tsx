"use client"

import type * as React from "react"
import { ConfigurableFilters } from "@/components/dashboard/ConfigurableFilters"
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar"
import type { PageFilterConfig } from "@/types"
import { useTranslations } from "next-intl"

interface SidebarRightProps extends React.ComponentProps<typeof Sidebar> {
  filterConfig?: PageFilterConfig;
}

export function SidebarRight({ filterConfig, ...props }: SidebarRightProps) {
  const t = useTranslations()

  return (
    <Sidebar 
      side="right" 
      className="top-16 bottom-0 h-auto max-h-screen" 
      {...props}
    >
      <SidebarContent className="overflow-y-auto">
        {filterConfig ? (
          <ConfigurableFilters config={filterConfig} />
        ) : (
          <div className="p-4 text-center text-muted-foreground text-sm">
            {t('dashboard.filter.noFilter')}
          </div>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}