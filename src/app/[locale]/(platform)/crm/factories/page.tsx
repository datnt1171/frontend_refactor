import { getFactories } from "@/lib/api/server"
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
// import { getTranslations } from "next-intl/server"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { OnsiteBadge } from "@/components/ui/OnsiteBadge"
import type { PageFilterConfig } from "@/types"


const FilterConfig: PageFilterConfig = {
  showResetButton: true,
  defaultValues: {
    is_active: 'true',
    page_size: '15',
    page: '1'
  },
  filters: [
    {
      id: 'is_active',
      type: 'select',
      label: 'Active',
      options: [
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' },
      ]
    },
    {
      id: 'has_onsite',
      type: 'select',
      label: 'Onsite',
      options: [
        { value: 'true', label: 'Yes' },
        { value: 'false', label: 'No' },
      ]
    },
    {
      id: 'search',
      type: 'search',
      label: 'Search Factory',
      placeholder: 'Search by Factory code, name'
    }
  ]
}

interface FactoryPageProps {
  searchParams: Promise<{
    is_active?: string,
    has_onsite?: string,
    search?: string,
    page?: string
    page_size?: string
  }>
}

export default async function UserListPage({ searchParams }: FactoryPageProps) {
  // const commonT = await getTranslations()
  const params = await searchParams
  
  const response = await getFactories(params)
  const factories = response.results

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
                      <TableHead>Factory Code</TableHead>
                      <TableHead>Factory Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Onsite</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {factories.map((factory) => (
                      <TableRow key={factory.factory_code}>
                        <TableCell className="font-mono text-sm">
                          <Link href={`/crm/factories/${factory.factory_code}`} className="hover:underline">
                            {factory.factory_code}
                          </Link>
                        </TableCell>
                        <TableCell className="font-medium">
                          {factory.factory_name}
                        </TableCell>
                        <TableCell>
                          <StatusBadge isActive={factory.is_active} />
                        </TableCell>
                        <TableCell>
                          <OnsiteBadge hasOnsite={factory.has_onsite} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DataPagination
                totalCount={response.count}
              />
            </div>
          </div>
          <SidebarRight filterConfig={FilterConfig} />
        </div>
      </SidebarProvider>
    </RightSidebarProvider>
  )
}