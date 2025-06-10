"use client"

import { useTranslations } from 'next-intl'
import { Link, usePathname } from "@/i18n/navigation"
import { navItems } from "@/constants/navigation"

interface NavigationProps {
  isMobile?: boolean
  onItemClick?: () => void
}

export function Navigation({ isMobile = false, onItemClick }: NavigationProps) {
  const pathname = usePathname()
  const t = useTranslations()

  return (
    <nav className={`${isMobile ? 'mt-5 px-2' : 'flex-1 px-2'} space-y-1`}>
      {navItems.map((item) => {
        const IconComponent = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center px-2 py-2 ${
              isMobile ? 'text-base' : 'text-sm'
            } font-medium rounded-md ${
              pathname === item.href
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={onItemClick}
          >
            <IconComponent className="mr-2 h-4 w-4" />
            {t(item.labelKey)}
          </Link>
        )
      })}
    </nav>
  )
}