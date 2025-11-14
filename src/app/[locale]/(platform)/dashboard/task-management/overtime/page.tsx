import { getOvertimes } from "@/lib/api/server"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { getTranslations } from "next-intl/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import type { PageFilterConfig } from "@/types"
import { formatDateToUTC7, addDayToDate } from "@/lib/utils/date"
import { timeDiff } from "@/lib/utils/time"
import { OvertimeCSVButtons } from "./OvertimeCSVButtons"
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Link } from "@/i18n/navigation"

interface PageProps {
  searchParams: Promise<{
    date_gte: string
    date_lte: string
  }>
}

// Helper function to create a unique key from row data
function getRowKey(row: any) {
  return `${row.factory_code}`
}

// Helper function to find duplicates
function findDuplicates(rows: any[]) {
  const keyMap = new Map<string, number>()
  const duplicateKeys = new Set<string>()
  
  rows.forEach(row => {
    const key = getRowKey(row)
    const count = keyMap.get(key) || 0
    keyMap.set(key, count + 1)
    if (count > 0) {
      duplicateKeys.add(key)
    }
  })
  
  return duplicateKeys
}

export default async function Page({ searchParams }: PageProps) {

  const t = await getTranslations()

  const FilterConfig: PageFilterConfig = {
    showResetButton: true,
    defaultValues: {
      date: {
        gte: format(toZonedTime(new Date(), 'Asia/Ho_Chi_Minh'), 'yyyy-MM-dd'),
        lte: format(toZonedTime(new Date(), 'Asia/Ho_Chi_Minh'), 'yyyy-MM-dd')
      },
    },
    filters: [
      {
        id: 'date',
        type: 'date-range',
        label: t('filter.selectDate')
      },
    ]
  }

  const params = await searchParams
  const today = new Date()
  const isSaturday = today.getDay() === 6
  
  const response = await getOvertimes(params)
  const rows = response

  // Find duplicate rows
  const duplicateKeys = findDuplicates(rows)

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />

        {/* Add download button */}
        <div className="flex justify-end mb-4">
          <OvertimeCSVButtons data={rows} />
        </div>

        <div className="space-y-8">
          {/* Today OT */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('common.today')} {t('user.overtime')}</h2>
            <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.date')}</TableHead>
                    <TableHead>{t('crm.factories.factoryId')}</TableHead>
                    <TableHead>{t('crm.factories.factoryName')}</TableHead>
                    <TableHead>{t('user.overtimeStart')}</TableHead>
                    <TableHead>{t('user.overtimeEnd')}</TableHead>
                    <TableHead>{t('user.overtimeNum')}</TableHead>
                    <TableHead>{t('blueprint.pallet')}</TableHead>
                    <TableHead>{t('blueprint.hanging')}</TableHead>
                    <TableHead>{t('common.others')}</TableHead>
                    <TableHead>{t('user.overtimeTotalHours')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center">
                        {t('common.noDataFound')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row) => {
                      const rowKey = getRowKey(row)
                      const isDuplicate = duplicateKeys.has(rowKey)
                      
                      return (
                        <TableRow 
                          key={row.task_id}
                          className={isDuplicate ? "bg-yellow-50 hover:bg-yellow-100" : ""}
                        >
                          <TableCell className="font-bold">
                            <Link href={`/task-management/tasks/${row.task_id}`} className="hover:underline">
                              {formatDateToUTC7(row.created_at,'date')}
                            </Link>
                          </TableCell>
                          <TableCell>{row.factory_code}</TableCell>
                          <TableCell>{row.factory_name}</TableCell>
                          <TableCell>{row.weekday_ot_start}</TableCell>
                          <TableCell>{row.weekday_ot_end}</TableCell>
                          <TableCell>{row.weekday_ot_num}</TableCell>
                          <TableCell>{row.pallet_line_today}</TableCell>
                          <TableCell>{row.hanging_line_today}</TableCell>
                          <TableCell>{row.others_today}</TableCell>
                          <TableCell>{timeDiff(row.weekday_ot_start, row.weekday_ot_end) * row.weekday_ot_num}</TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        
          {/* Tomorrow OT */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('common.tomorrow')} {t('user.overtime')}</h2>
            <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.date')} ({t('common.tomorrow')})</TableHead>
                    <TableHead>{t('crm.factories.factoryId')}</TableHead>
                    <TableHead>{t('crm.factories.factoryName')}</TableHead>
                    <TableHead>{t('blueprint.pallet')}</TableHead>
                    <TableHead>{t('blueprint.hanging')}</TableHead>
                    <TableHead>{t('common.others')}</TableHead>
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
                        <TableCell className="font-bold">
                          <Link href={`/task-management/tasks/${row.task_id}`} className="hover:underline">
                            {formatDateToUTC7(isSaturday ? addDayToDate(row.created_at, 2) : addDayToDate(row.created_at, 1), 'date')}
                          </Link>
                        </TableCell>
                        <TableCell>{row.factory_code}</TableCell>
                        <TableCell>{row.factory_name}</TableCell>
                        <TableCell>{row.hanging_line_tomorrow}</TableCell>
                        <TableCell>{row.pallet_line_tomorrow}</TableCell>
                        <TableCell>{row.others_tomorrow}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {/* Sunday OT */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('common.sunday')} {t('user.overtime')}</h2>
            <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.date')}</TableHead>
                    <TableHead>{t('crm.factories.factoryId')}</TableHead>
                    <TableHead>{t('crm.factories.factoryName')}</TableHead>
                    <TableHead>{t('common.sunday')} {t('user.overtimeStart')}</TableHead>
                    <TableHead>{t('common.sunday')} {t('user.overtimeEnd')}</TableHead>
                    <TableHead>{t('common.sunday')} {t('user.overtimeNum')}</TableHead>
                    <TableHead>{t('blueprint.pallet')}</TableHead>
                    <TableHead>{t('blueprint.hanging')}</TableHead>
                    <TableHead>{t('common.others')}</TableHead>
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
                        <TableCell className="font-bold">
                          <Link href={`/task-management/tasks/${row.task_id}`} className="hover:underline">
                            {formatDateToUTC7(isSaturday ? addDayToDate(row.created_at, 1) : row.created_at, 'date')}
                          </Link>
                        </TableCell>
                        <TableCell>{row.factory_code}</TableCell>
                        <TableCell>{row.factory_name}</TableCell>
                        <TableCell>{row.sunday_ot}</TableCell>
                        <TableCell>{row.sunday_ot_end}</TableCell>
                        <TableCell>{row.sunday_ot_num}</TableCell>
                        <TableCell>{row.pallet_line_sunday}</TableCell>
                        <TableCell>{row.hanging_line_sunday}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </SidebarInset>
      
      <SidebarRight filterConfig={FilterConfig} />
    </SidebarProvider>
  )
}