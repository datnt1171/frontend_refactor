import type React from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <div className="sticky top-14 z-10 bg-background border-b">
            <div className="flex items-center gap-2 lg:hidden">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-4" />
            </div>
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}