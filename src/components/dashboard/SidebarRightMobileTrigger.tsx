"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { useTranslations } from "next-intl"

export function SidebarRightMobileTrigger() {
  const t = useTranslations()
  
  return (
    <div className="bg-background border-b lg:hidden">
      <div className="flex items-center">
        <SidebarTrigger className="-ml-1" />
        <span className="text-sm font-medium">{t('filter.filter')}</span>
      </div>
    </div>
  )
}