"use client"

import { useTranslations } from 'next-intl'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { externalApps } from "@/constants/navigation"
import Link from "next/link"

export function ExternalAppsMenu() {
  const t = useTranslations()

  return (
    <>
      {/* Desktop External Apps */}
      <div className="hidden lg:flex items-center space-x-2">
        {externalApps.map((app) => {
          const IconComponent = app.icon
          return (
            <Link
              key={app.nameKey}
              href={app.href}
              className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <IconComponent className="mr-2 h-4 w-4" />
              {t(app.nameKey)}
            </Link>
          )
        })}
      </div>

      {/* Mobile External Apps Dropdown */}
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center">
              {t('navBar.externalApps.apps')} <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {externalApps.map((app) => {
              const IconComponent = app.icon
              return (
                <DropdownMenuItem key={app.nameKey} asChild>
                  <Link
                    href={app.href}
                    className="flex items-center w-full"
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    {t(app.nameKey)}
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}