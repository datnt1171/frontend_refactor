"use client"

import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { ExternalAppsMenu } from "./ExternalAppsMenu"
import { LanguageSelector } from "./LanguageSelector"
import { UserMenu } from "./UserMenu"

interface TopNavbarProps {
  isMobileMenuOpen: boolean
  onToggleMobileMenu: () => void
  onLogout: () => void
}

export function TopNavbar({ 
  isMobileMenuOpen, 
  onToggleMobileMenu, 
  onLogout 
}: TopNavbarProps) {
  const t = useTranslations()

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm h-16">
      <div className="flex items-center justify-between px-4 py-3 h-full">
        {/* Left side - Mobile menu button + Logo */}
        <div className="flex items-center">
          <div className="md:hidden mr-3">
            <Button
              variant="outline"
              size="icon"
              onClick={onToggleMobileMenu}
              aria-label="Toggle menu"
              className="h-8 w-8"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
          <div className="hidden md:block md:w-64 md:pr-4">
            <h1 className="text-xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          </div>
        </div>

        {/* Right side - External apps + Language selector + User menu */}
        <div className="flex items-center space-x-3">
          <ExternalAppsMenu />
          <LanguageSelector />
          <UserMenu onLogout={onLogout} />
        </div>
      </div>
    </div>
  )
}