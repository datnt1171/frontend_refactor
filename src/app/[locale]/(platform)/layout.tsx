"use client"

import type React from "react"
import { useEffect } from "react"
import { useAuthStore } from "@/stores/authStore"
import { useMobileMenu } from "@/hooks/ui/useMobileMenu"
import { TopNavbar } from "@/components/layout/TopNavbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { MobileMenu } from "@/components/layout/MobileMenu"

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { fetchUser } = useAuthStore()
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu()

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TopNavbar 
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={toggleMobileMenu}
      />

      <Sidebar />

      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
      />

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1 overflow-x-auto" style={{ paddingTop: '64px' }}>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}