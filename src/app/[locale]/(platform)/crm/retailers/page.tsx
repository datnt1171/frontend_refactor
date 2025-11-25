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
import { getTranslations, getLocale } from "next-intl/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import type { PageFilterConfig } from "@/types"
import { redirectWithDefaults } from "@/lib/utils/filter"

interface RetailerPageProps {
  searchParams: Promise<{
    search?: string,
    page?: string
    page_size?: string
  }>
}

export default async function Page({ searchParams }: RetailerPageProps) {

  const params = await searchParams
  const locale = await getLocale()
  const t = await getTranslations()

  const defaultParams = {
    page_size: '15',
    page: '1'
  }

  redirectWithDefaults({
    currentParams: params,
    defaultParams,
    pathname: '/crm/retailers',
    locale
  });

  const FilterConfig: PageFilterConfig = {
    showResetButton: true,
    isPaginated: true,
    
    filters: [
      {
        id: 'search',
        type: 'search',
        label: t('filter.searchRetailer'),
        placeholder: t('filter.searchRetailerHolder')
      }
    ]
  }

  
  const response = await getRetailers(params)
  const retailers = response.results

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />

        <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('crm.retailer.retailer')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {retailers.map((retailer) => (
                <TableRow key={retailer.id}>
                  <TableCell className="font-bold text-sm">
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
      </SidebarInset>
      
      <SidebarRight filterConfig={FilterConfig} />
    </SidebarProvider>
  )
}