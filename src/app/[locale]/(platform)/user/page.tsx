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
import { getTranslations, getLocale } from "next-intl/server"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import { redirect } from "@/i18n/navigation"
import type { PageFilterConfig } from "@/types"


const UserFilterConfig: PageFilterConfig = {
  showApplyButton: false,
  showResetButton: true,
  filters: [
    {
      id: 'ordering',
      type: 'sort',
      label: 'Sort Options',
      placeholder: 'Select sort order...',
      sortFields: [
        { value: 'username', label: 'Username' },
        { value: 'first_name', label: 'First name' }
      ]
    },
    {
      id: 'search',
      type: 'search',
      label: 'Search User',
      placeholder: 'Search by username, name'
    }
  ]
}

interface UserPageProps {
  searchParams: Promise<{
    ordering?: string
    search?: string,
    page?: string
    page_size?: string
  }>
}

export default async function UserListPage({ searchParams }: UserPageProps) {
  const commonT = await getTranslations("common")
  const t = await getTranslations("user")
  const params = await searchParams
  
  // Redirect to default URL if page or page_size are missing
  if (!params.page || !params.page_size) {
    const defaultParams = new URLSearchParams()
    
    // Set defaults
    defaultParams.set('page', params.page || '1')
    defaultParams.set('page_size', params.page_size || '15')
    
    // Preserve existing params
    if (params.ordering) defaultParams.set('ordering', params.ordering)
    if (params.search) defaultParams.set('search', params.search)
    const locale = await getLocale()
    redirect({href: `/user?${defaultParams.toString()}`, locale: locale})
  }
  
  const response = await getUsers(params)
  const users = response.results

  return (
    <RightSidebarProvider>
      <SidebarProvider>
        <div className="flex flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="sticky top-14 z-10 bg-background px-2">
              <div className="flex items-center gap-2 lg:hidden">
                <SidebarTrigger />
                <span className="text-sm font-medium">Filter</span>
              </div>
              
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
              <DataPagination
                totalCount={response.count}
              />
            </div>
          </div>
          <SidebarRight filterConfig={UserFilterConfig} />
        </div>
      </SidebarProvider>
    </RightSidebarProvider>
  )
}