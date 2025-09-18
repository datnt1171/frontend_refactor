"use client"

import { useTranslations } from 'next-intl'
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, ChevronDown, SquareUserRound } from "lucide-react"
import { logout } from "@/lib/api/client/api"
import type { UserDetail } from "@/types/api"

interface UserMenuProps {
  user: UserDetail
}

export function UserMenu({ user }: UserMenuProps) {
  const t = useTranslations()

  const handleLogout = async () => {
    try {
      await logout()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Error logging out:', error)
      // Still redirect on error
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center h-10 px-2">
          <div className="text-right mr-2 hidden sm:block">
            <p className="text-sm font-medium text-gray-700">{user.username}</p>
            <p className="text-xs text-gray-500 truncate max-w-24">
              {user.department?.name || user.role?.name || ""}
            </p>
          </div>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-gray-700">
              {user.first_name?.[0] || user.username?.[0] || "U"}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link
            href="/me"
            className="flex items-center w-full"
          >
            <SquareUserRound className="h-4 w-4 mr-2" />
            {t('navBar.userMenu.profile')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <button
            onClick={handleLogout}
            className="flex items-center w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t('navBar.userMenu.logout')}
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}