import { SidebarTrigger } from "@/components/ui/sidebar"
import { ExternalAppsMenu } from "./ExternalAppsMenu"
import { LanguageSelector } from "./LanguageSelector"
import { UserMenu } from "./UserMenu"
import { getCurrentUser } from "@/lib/api/server"

export async function TopNavbar() {
  const user = await getCurrentUser()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      {/* Sidebar trigger - only visible on mobile or when sidebar is collapsed */}
      <SidebarTrigger className="-ml-1" />

      {/* Spacer to push right-side content to the right */}
      <div className="flex-1" />

      {/* Right side - External apps + Language selector + User menu */}
      <div className="flex items-center gap-0 sm:gap-3">
        <ExternalAppsMenu />
        <LanguageSelector />
        <UserMenu user={user} />
      </div>
    </header>
  )
}