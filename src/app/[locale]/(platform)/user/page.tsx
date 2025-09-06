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
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import type { PageFilterConfig } from "@/types"


const warehouseAgingFilterConfig: PageFilterConfig = {
  showApplyButton: true,
  showResetButton: true,
  filters: [
    {
      id: 'ordering',
      type: 'select',
      label: 'Years',
      options: [
        { value: 'username', label: 'Username (A-Z)' },
        { value: '-username', label: 'Username (Z-A)' },
        { value: 'first_name', label: 'Name (A-Z)' },
        { value: '-first_name', label: 'Name (Z-A)' },
      ]
    },
    {
      id: 'search',
      type: 'search',
      label: 'Search Items',
      placeholder: 'Search by item name, SKU...'
    }
  ],
  defaultValues: {
    ordering: 'username'
  }
}

interface UserPageProps {
  searchParams: Promise<{
    ordering?: string
    search? :string,
    page?: string
    page_size?: string
  }>
}


export default async function UserListPage({ searchParams }: UserPageProps) {
  const commonT = await getTranslations("common")
  const t = await getTranslations("user")
  const params = await searchParams
  
  const response = await getUsers(params)
  const users = response.results

  return (
    <RightSidebarProvider>
      <SidebarProvider>
        <div className="flex flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="sticky top-14 z-10 bg-background border-b px-4 py-2">
              <div className="flex items-center gap-2 lg:hidden">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-4" />
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
            </div>
          </div>
          <SidebarRight filterConfig={warehouseAgingFilterConfig} />
        </div>
      </SidebarProvider>
    </RightSidebarProvider>
    
    
  )
}