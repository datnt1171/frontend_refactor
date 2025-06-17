"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getUser } from "@/lib/api/users"
import type { UserList } from "@/types/api"
import { useLocale, useTranslations } from "next-intl"

export default function UserDetailPage() {
  const { id } = useParams() as { id: string }
  const [user, setUser] = useState<UserList | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations("dashboard.user")
  const locale = useLocale()

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      try {
        const res = await getUser(id)
        setUser(res)
      } catch (err: any) {
        setError(t("errorLoadingUser", { defaultValue: "Failed to fetch user" }))
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (loading) {
    return <div className="p-8 text-center">{t("loading", { defaultValue: "Loading..." })}</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>
  }

  if (!user) {
    return <div className="p-8 text-center">{t("userNotFound", { defaultValue: "User not found." })}</div>
  }

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">{t("userDetail", { defaultValue: "User Detail" })}</h1>
      <div className="mb-2"><span className="font-semibold">{t("username", { defaultValue: "Username" })}:</span> {user.username}</div>
      <div className="mb-2"><span className="font-semibold">{t("firstName", { defaultValue: "First Name" })}:</span> {user.first_name || "-"}</div>
      <div className="mb-2"><span className="font-semibold">{t("lastName", { defaultValue: "Last Name" })}:</span> {user.last_name || "-"}</div>
    </div>
  )
}
