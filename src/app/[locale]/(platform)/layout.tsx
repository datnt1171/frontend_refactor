import type React from "react"
import { TopNavbar } from "@/components/layout/TopNavbar"
import { AppSidebar } from "@/components/layout/Sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-w-0">
        <TopNavbar />
        <div className="flex flex-1 flex-col min-w-0">
          <main className="flex-1 p-4 md:p-6 min-w-0">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}