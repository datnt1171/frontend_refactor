"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { useTranslations } from "next-intl"

export function SidebarRightMobileTrigger() {
  const t = useTranslations()
  
  return (
    <div className="z-10 bg-background border-b lg:hidden">
      <div className="flex h-12 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <span className="text-sm font-medium">{t('filter.filter')}</span>
      </div>
    </div>
  )
}