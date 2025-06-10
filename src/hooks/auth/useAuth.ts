"use client"

import { useState, useEffect } from "react"
import { useRouter } from "@/i18n/navigation"
import { getCurrentUser, logout, refreshToken } from "@/lib/api"
import type { User } from "@/contexts/UserContext"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
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
      // If we can't get the user, handle gracefully without localStorage
      // You might want to redirect to login or show an error state
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      if (isClient && typeof window !== 'undefined') {
        localStorage.removeItem("user")
      }
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
      // Even if the API call fails, we'll still clear local storage and redirect
      if (isClient && typeof window !== 'undefined') {
        localStorage.removeItem("user")
      }
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