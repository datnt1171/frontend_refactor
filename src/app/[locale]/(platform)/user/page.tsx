"use client"

import { useEffect, useState } from "react"
import { getUsers } from "@/lib/api/users"
import type { UserList } from "@/types/api"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

export default function UserListPage() {
  const [users, setUsers] = useState<UserList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations("dashboard.user")

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const res = await getUsers()
        setUsers(res.results)
      } catch (err: any) {
        setError(t("errorLoadingUsers", { defaultValue: "Failed to fetch users" }))
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  if (loading) {
    return <div className="p-8 text-center">{t("loading", { defaultValue: "Loading..." })}</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>
  }

  return (
    <div className="p-6">
      <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("username", { defaultValue: "Username" })}</TableHead>
              <TableHead>{t("firstName", { defaultValue: "First Name" })}</TableHead>
              <TableHead>{t("lastName", { defaultValue: "Last Name" })}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  {t("noUsersFound", { defaultValue: "No users found." })}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link
                      href={`/user/${user.id}`}
                      className="text-black-600 hover:underline"
                    >
                      {user.username}
                    </Link>
                  </TableCell>
                  <TableCell>{user.first_name || "-"}</TableCell>
                  <TableCell>{user.last_name || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}