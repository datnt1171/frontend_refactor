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
import { getTranslations } from "next-intl/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { OnsiteBadge } from "@/components/ui/OnsiteBadge"
import type { PageFilterConfig } from "@/types"

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

  const t = await getTranslations()

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
        label: t('filter.active'),
        options: [
          { value: 'true', label: t('filter.active') },
          { value: 'false', label: t('filter.inactive') },
        ]
      },
      {
        id: 'has_onsite',
        type: 'select',
        label: t('filter.onsite'),
        options: [
          { value: 'true', label: t('common.yes') },
          { value: 'false', label: t('common.no') },
        ]
      },
      {
        id: 'search',
        type: 'search',
        label: t('filter.searchFactory'),
        placeholder: t('filter.searchFactoryHolder')
      }
    ]
  }

  const params = await searchParams
  
  const response = await getFactories(params)
  const factories = response.results

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />

        <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('crm.factories.factoryId')}</TableHead>
                <TableHead>{t('crm.factories.factoryName')}</TableHead>
                <TableHead>{t('crm.factories.status')}</TableHead>
                <TableHead>{t('crm.factories.onsite')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {factories.map((factory) => (
                <TableRow key={factory.factory_code}>
                  <TableCell className="font-bold text-sm">
                    <Link href={`/crm/factories/${factory.factory_code}`} className="hover:underline">
                      {factory.factory_code}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {factory.factory_name}
                  </TableCell>
                  <TableCell>
                    <StatusBadge 
                      isActive={factory.is_active} 
                      activeText={t('filter.active')}
                      inactiveText={t('filter.inactive')}
                    />
                  </TableCell>
                  <TableCell>
                    <OnsiteBadge 
                      hasOnsite={factory.has_onsite}
                      yesText={t('common.yes')}
                      noText={t('common.no')}
                    />
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