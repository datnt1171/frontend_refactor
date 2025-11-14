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
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import type { PageFilterConfig } from "@/types"
import { formatDateToUTC7 } from "@/lib/utils/date"
import { daysDiff } from "@/lib/utils/date"
import { TransferAbsenceCSVButtons } from "./TransferAbsenceCSVButton"
import { format, endOfMonth } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Link } from "@/i18n/navigation"
import { getDepartmentOptions } from "@/lib/utils/filter"

interface PageProps {
  searchParams: Promise<{
    date_gte: string
    date_lte: string
  }>
}

// Helper function to create a unique key from ALL row data
function getRowKey(row: any) {
  return `${row.from_date}|${row.to_date}|${row.department}|${row.username}|${row.last_name}|${row.first_name}|${row.factory_name_onsite}|${row.factory_name}`
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
        lte: format(endOfMonth(toZonedTime(new Date(), 'Asia/Ho_Chi_Minh')), 'yyyy-MM-dd')
      },
      user__department__name: ['KTW', 'KTC', 'TT']
    },
    filters: [
      {
        id: 'date',
        type: 'date-range',
        label: t('filter.selectDate')
      },
      {
        id: 'user__department__name',
        type: 'multiselect',
        label: t('filter.selectDepartment'),
        options: getDepartmentOptions()
      },
    ]
  }

  const params = await searchParams
  const rows = await getTransferAbsences(params)

  // Find duplicate rows
  const duplicateKeys = findDuplicates(rows)

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />

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
                  <TableCell colSpan={8} className="text-center">
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
                          {formatDateToUTC7(row.from_date, 'date')}
                        </Link>
                      </TableCell>
                      <TableCell>{formatDateToUTC7(row.to_date, 'date')}</TableCell>
                      <TableCell>{row.department}</TableCell>
                      <TableCell>{row.username}</TableCell>
                      <TableCell>{row.last_name + " " + row.first_name}</TableCell>
                      <TableCell>{row.factory_name_onsite}</TableCell>
                      <TableCell>{row.factory_name || t('user.absence')}</TableCell>
                      <TableCell>{daysDiff(row.from_date, row.to_date) + 1}</TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </SidebarInset>
      
      <SidebarRight filterConfig={FilterConfig} />
    </SidebarProvider>
  )
}