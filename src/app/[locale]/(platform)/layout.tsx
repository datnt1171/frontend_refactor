import type React from "react"
import { getCurrentUser } from "@/lib/api/server"
import { TopNavbar } from "@/components/layout/TopNavbar"
import { AppSidebar } from "@/components/layout/Sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user = null
  try {
    user = await getCurrentUser()
  } catch (error) {
    console.error("Error fetching user:", error)
    // Handle error appropriately
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* TopNavbar is inside SidebarInset */}
        <TopNavbar user={user} />
        {/* Main content */}
        <div className="flex flex-1 flex-col">
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
