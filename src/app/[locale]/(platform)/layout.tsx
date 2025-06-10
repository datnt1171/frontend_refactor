"use client"

import type React from "react"
import { useTranslations } from 'next-intl'
import { Loader2 } from "lucide-react"
import { UserContext } from "@/contexts/UserContext"
import { useAuth } from "@/hooks/auth/useAuth"
import { useMobileMenu } from "@/hooks/ui/useMobileMenu"
import { TopNavbar } from "@/components/layout/TopNavbar"
import { Sidebar } from "@/components/layout/Sidebar"
import { MobileMenu } from "@/components/layout/MobileMenu"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, handleLogout } = useAuth()
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu()
  const t = useTranslations()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">{t('dashboard.loading')}</span>
      </div>
    )
  }

  return (
    <UserContext.Provider value={user}>
      <div className="flex min-h-screen bg-gray-50">
        <TopNavbar 
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={toggleMobileMenu}
          onLogout={handleLogout}
        />

        <Sidebar />

        <MobileMenu 
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
        />

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1" style={{ paddingTop: '64px' }}>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </UserContext.Provider>
  )
}