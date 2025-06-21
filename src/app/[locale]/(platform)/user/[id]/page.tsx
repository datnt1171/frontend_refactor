"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getUser } from "@/lib/api/users"
import type { UserList } from "@/types/api"
import { useTranslations } from "next-intl"

export default function UserDetailPage() {
  const { id } = useParams() as { id: string }
  const [user, setUser] = useState<UserList | null>(null)
  const t = useTranslations("dashboard.user")

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUser(id)
      setUser(res)
    }
    fetchUser()
  }, [id])

  if (!user) {
    return <div className="p-8 text-center">{t("userNotFound")}</div>
  }

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">{t("userDetail")}</h1>
      <div className="mb-2"><span className="font-semibold">{t("username")}:</span> {user.username}</div>
      <div className="mb-2"><span className="font-semibold">{t("firstName")}:</span> {user.first_name || "-"}</div>
      <div className="mb-2"><span className="font-semibold">{t("lastName")}:</span> {user.last_name || "-"}</div>
    </div>
  )
}
