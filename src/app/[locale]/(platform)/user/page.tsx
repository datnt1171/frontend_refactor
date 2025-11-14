import { getUsers } from "@/lib/api/server"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { DataPagination } from "@/components/dashboard/Pagination"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import type { PageFilterConfig } from "@/types"

interface UserPageProps {
  searchParams: Promise<{
    ordering?: string
    search?: string,
    page?: string
    page_size?: string
  }>
}

export default async function UserListPage({ searchParams }: UserPageProps) {

  const t = await getTranslations()

  const FilterConfig: PageFilterConfig = {
    showResetButton: true,
    defaultValues: {
      ordering: 'username',
      page_size: '15',
      page: '1'
    },
    filters: [
      {
        id: 'ordering',
        type: 'sort',
        label: t('filter.sortBy'),
        placeholder: t('filter.sortBy'),
        sortFields: [
          { value: 'username', label: t('user.username') },
          { value: 'first_name', label: t('user.firstName') }
        ]
      },
      {
        id: 'search',
        type: 'search',
        label: t('filter.searchUser'),
        placeholder: t('filter.searchUserHolder')
      }
    ]
  }

  const params = await searchParams

  const response = await getUsers(params)
  const users = response.results

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />

        <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('user.username')}</TableHead>
                <TableHead>{t('user.lastName')}</TableHead>
                <TableHead>{t('user.firstName')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    {t('common.noDataFound')}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Link
                        href={`/user/${user.id}`}
                        className="text-black-600 font-bold hover:underline"
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
        <DataPagination
          totalCount={response.count}
        />
      </SidebarInset>
      
      <SidebarRight filterConfig={FilterConfig} />
    </SidebarProvider>
  )
}