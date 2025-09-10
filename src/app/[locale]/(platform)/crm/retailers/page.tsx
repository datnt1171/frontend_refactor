import { getRetailers } from "@/lib/api/server"
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
import type { PageFilterConfig } from "@/types"


const FilterConfig: PageFilterConfig = {
  showResetButton: true,
  defaultValues: {
    page_size: '15',
    page: '1'
  },
  filters: [
    {
      id: 'search',
      type: 'search',
      label: 'Search Retailer',
      placeholder: 'Search by Retailer name'
    }
  ]
}

interface RetailerPageProps {
  searchParams: Promise<{
    search?: string,
    page?: string
    page_size?: string
  }>
}

export default async function UserListPage({ searchParams }: RetailerPageProps) {
  // const commonT = await getTranslations()
  const params = await searchParams
  
  const response = await getRetailers(params)
  const retailers = response.results

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
                      <TableHead>Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {retailers.map((retailer) => (
                      <TableRow key={retailer.id}>
                        <TableCell className="font-mono text-sm">
                          <Link href={`/crm/retailers/${retailer.id}`} className="hover:underline">
                            {retailer.name}
                          </Link>
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