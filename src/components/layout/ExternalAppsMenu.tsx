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
import { usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

export function ExternalAppsMenu() {
  const t = useTranslations()
  const pathname = usePathname()

  return (
    <>
      {/* Desktop External Apps */}
      <div className="hidden lg:flex items-center space-x-2">
        {externalApps.map((app) => {
          const IconComponent = app.icon
          const isActive = pathname.startsWith(app.href)
          return (
            <Link
              key={app.nameKey}
              href={app.href}
                className={cn(
                  "flex items-center px-3 py-1.5 text-sm transition-colors relative",
                  "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:transition-all",
                  isActive 
                    ? "text-black after:w-2/3 after:bg-black" 
                    : "text-gray-600 after:w-0 hover:text-black hover:after:w-1/2 hover:after:bg-gray-400"
                )}
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