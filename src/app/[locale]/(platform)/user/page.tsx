import { getUsers } from "@/lib/api/server"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"

export default async function UserListPage() {
  const commonT = await getTranslations("common")
  const t = await getTranslations("user")
  const response = await getUsers()
  const users = response.results
  return (
    <div className="p-6">
      <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('username')}</TableHead>
              <TableHead>{t('lastName')}</TableHead>
              <TableHead>{t('firstName')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  {commonT('noDataFound')}
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
                  <TableCell>{user.last_name || "-"}</TableCell>
                  <TableCell>{user.first_name || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}