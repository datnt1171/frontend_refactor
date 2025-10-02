import { getTransferAbsences } from "@/lib/api/server"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { getTranslations } from "next-intl/server"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import type { PageFilterConfig } from "@/types"
import { formatDateToUTC7 } from "@/lib/utils/date"
import { daysDiff } from "@/lib/utils/date"
import { TransferAbsenceCSVButtons } from "./TransferAbsenceCSVButton"
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

const FilterConfig: PageFilterConfig = {
  showResetButton: true,
  defaultValues: {
    date__gte: format(toZonedTime(new Date(), 'Asia/Ho_Chi_Minh'), 'yyyy-MM-dd'),
    date__lte: format(toZonedTime(new Date(), 'Asia/Ho_Chi_Minh'), 'yyyy-MM-dd')
  },
  filters: [
    {
      id: 'date',
      type: 'date-range',
      label: 'Select Date'
    },
  ]
}

interface PageProps {
  searchParams: Promise<{
    date_gte: string
    date_lte: string
  }>
}

export default async function Page({ searchParams }: PageProps) {
  const t = await getTranslations()
  const params = await searchParams
  
  const response = await getTransferAbsences(params)
  const rows = response

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
              
              
              <div className="flex justify-end mb-4">
                <TransferAbsenceCSVButtons data={rows} />
              </div>
              
              <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('common.startDate')}</TableHead>
                      <TableHead>{t('common.endDate')}</TableHead>
                      <TableHead>{t('user.department')}</TableHead>
                      <TableHead>{t('user.username')}</TableHead>
                      <TableHead>{t('user.fullName')}</TableHead>
                      <TableHead>{t('crm.factories.onsite')}</TableHead>
                      <TableHead>{t('crm.factories.support')}</TableHead>
                      <TableHead>{t('common.numOfDays')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          {t('common.noDataFound')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      rows.map((row) => (
                        <TableRow key={row.task_id}>
                          <TableCell>{formatDateToUTC7(row.from_date, 'date')}</TableCell>
                          <TableCell>{formatDateToUTC7(row.to_date, 'date')}</TableCell>
                          <TableCell>{row.department}</TableCell>
                          <TableCell>{row.username}</TableCell>
                          <TableCell>{row.first_name + " " + row.last_name}</TableCell>
                          <TableCell>{row.factory_name_onsite}</TableCell>
                          <TableCell>{row.factory_name || t('user.absence')}</TableCell>
                          <TableCell>{daysDiff(row.from_date, row.to_date) + 1}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          <SidebarRight filterConfig={FilterConfig} />
        </div>
      </SidebarProvider>
    </RightSidebarProvider>
  )
}