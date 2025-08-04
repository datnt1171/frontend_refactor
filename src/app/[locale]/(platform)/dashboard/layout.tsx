import type React from "react"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { RightSidebarProvider } from "@/contexts/FilterContext"

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RightSidebarProvider>
      <SidebarProvider>
        <div className="flex flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="sticky top-14 z-10 bg-background border-b px-4 py-2">
              <div className="flex items-center gap-2 lg:hidden">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm font-medium">Filter</span>
              </div>
              {children}
            </div>
          </div>
          <SidebarRight />
        </div>
      </SidebarProvider>
    </RightSidebarProvider>
  )
}
