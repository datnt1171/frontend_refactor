//src\app\[locale]\(platform)\dashboard\layout.tsx
import type React from "react"
import { DashboardRightSidebar } from "@/components/layout/DashboardRightSidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 min-w-0">
      {/* Main content area */}
      <div className="flex-1 min-w-0">
        {children}
      </div>
      {/* Right sidebar */}
      <DashboardRightSidebar />
    </div>
  )
}