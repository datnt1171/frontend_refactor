import { getCustomerEntry } from "@/lib/api/server"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getStatusColor } from "@/lib/utils/format"
import { getTranslations, getLocale } from "next-intl/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import type { PageFilterConfig } from "@/types"
import { formatDateToUTC7 } from "@/lib/utils/date"
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Link } from "@/i18n/navigation"
import { getYearOptions, getMonthOptions, getTTVNOptions, redirectWithDefaults } from "@/lib/utils/filter"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface PageProps {
  searchParams: Promise<{
    month: string
    year: string
    created_by_id: string
  }>
}

export default async function Page({ searchParams }: PageProps) {

  const t = await getTranslations()
  const rows = await getCustomerEntry()

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />
        
        <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto mb-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.createdAt')}</TableHead>
                <TableHead>{t('common.createdBy')}</TableHead>
                <TableHead>{t('crm.factories.factoryName')}</TableHead>
                <TableHead>{t('taskManagement.common.status')}</TableHead>
                <TableHead>{t('common.detail')}</TableHead>
                <TableHead>{t('fleet.trip.licensePlate')}</TableHead>
                <TableHead>{t('fleet.trip.driver')}</TableHead>
                <TableHead>{t('common.estimatedArriveTime')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    {t('common.noDataFound')}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => {
                  return (
                    <TableRow 
                      key={row.task_id}
                    >
                      <TableCell className="font-bold border-r border-gray-300">
                        <Link href={`/task-management/tasks/${row.task_id}`} className="hover:underline">
                          {formatDateToUTC7(row.created_at, 'date')}
                        </Link>
                      </TableCell>
                      <TableCell className="border-r border-gray-300 whitespace-normal break-words max-w-[150px]">
                        {row.created_by}
                      </TableCell>
                      <TableCell  className="border-r border-gray-300 whitespace-normal break-words max-w-[150px]">
                        {row.factory_name}
                      </TableCell>
                      <TableCell className="border-r border-gray-300 whitespace-normal break-words max-w-[150px]">
                        {row.note}
                      </TableCell>
                      <TableCell className="border-r border-gray-300 whitespace-normal break-words max-w-[150px]">
                        <Badge variant="outline" className={getStatusColor(row.state_type)}>
                            {row.state}
                        </Badge>
                      </TableCell>
                      <TableCell className="border-r border-gray-300 whitespace-normal break-words max-w-[150px]">
                        {row.drive_name}
                      </TableCell>
                      <TableCell className="border-r border-gray-300 whitespace-normal break-words max-w-[150px]">
                        {row.license_plate}
                      </TableCell>
                      <TableCell className="border-r border-gray-300 whitespace-normal break-words max-w-[150px]">
                        {row.scheduled_date} {row.scheduled_time}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </SidebarInset>
      
    </SidebarProvider>
  )
}