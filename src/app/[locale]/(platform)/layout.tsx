import type React from "react"
import { getCurrentUser } from "@/lib/api/server"
import { TopNavbar } from "@/components/layout/TopNavbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { MobileMenu } from "@/components/layout/MobileMenu"

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let user = null
  try {
    user = await getCurrentUser()
  } catch (error) {
    console.error('Error fetching user:', error)
    // Handle error appropriately
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Pass user directly to TopNavbar, let components handle their own mobile menu state */}
      <TopNavbar user={user} />
      <Sidebar />
      <MobileMenu />

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1 overflow-x-auto" style={{ paddingTop: '64px' }}>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}