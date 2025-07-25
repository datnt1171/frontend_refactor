"use client"

import { useTranslations } from "next-intl"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ExternalAppsMenu } from "./ExternalAppsMenu"
import { LanguageSelector } from "./LanguageSelector"
import { UserMenu } from "./UserMenu"
import type { UserDetail } from "@/types/api"

interface TopNavbarProps {
  user: UserDetail | null
}

export function TopNavbar({ user }: TopNavbarProps) {
  const t = useTranslations()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      {/* Sidebar trigger - only visible on mobile or when sidebar is collapsed */}
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      {/* Spacer to push right-side content to the right */}
      <div className="flex-1" />

      {/* Right side - External apps + Language selector + User menu */}
      <div className="flex items-center space-x-3">
        <ExternalAppsMenu />
        <LanguageSelector />
        {/* Only show UserMenu in navbar if not in sidebar */}
        <div className="md:block">
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  )
}