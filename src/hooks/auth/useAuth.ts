"use client"

import { useState, useEffect } from "react"
import { useRouter } from "@/i18n/navigation"
import { getCurrentUser, logout, refreshToken } from "@/lib/api"
import type { UserDetail } from "@/types/api"

export function useAuth() {
  const [user, setUser] = useState<UserDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchCurrentUser()

    // Set up token refresh interval
    const refreshInterval = setInterval(
      () => {
        // Refresh token every 25 minutes (5 minutes before the 30-minute expiry)
        refreshToken().catch(console.error)
      },
      25 * 60 * 1000,
    )

    return () => clearInterval(refreshInterval)
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const response = await getCurrentUser()
      setUser(response.data)
    } catch (error) {
      console.error("Error fetching user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
      router.push("/login")
    }
  }

  return {
    user,
    isLoading,
    handleLogout,
    refreshUser: fetchCurrentUser
  }
}