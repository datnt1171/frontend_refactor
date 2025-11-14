import { getDailyMovement } from "@/lib/api/server"
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
import { getTranslations } from "next-intl/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import type { PageFilterConfig } from "@/types"
import { formatDateToUTC7 } from "@/lib/utils/date"
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Link } from "@/i18n/navigation"
import { getYearOptions, getMonthOptions } from "@/lib/utils/filter"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"


interface PageProps {
  searchParams: Promise<{
    date_gte: string
    date_lte: string
  }>
}

// Helper function to create a unique key from ALL row data
function getRowKey(row: any) {
  return `${row.created_at}|${row.created_by}|${row.factory_code}`
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
  const today = toZonedTime(new Date(), 'Asia/Ho_Chi_Minh');

  const FilterConfig: PageFilterConfig = {
    showResetButton: true,
    defaultValues: {
      year: format(today, 'yyyy'),
      month: format(today, 'M')
    },
    filters: [
      {
        id: 'year',
        type: 'select',
        label: t('filter.selectYear'),
        options: getYearOptions()
      },
      {
        id: 'month',
        type: 'select',
        label: t('filter.selectMonth'),
        options: await getMonthOptions()
      },
    ]
  }

  const params = await searchParams
  const rows = await getDailyMovement(params)
  // Find duplicate rows
  const duplicateKeys = findDuplicates(rows)

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />

        <div className="pb-2">
          <Link href={`/task-management/processes/${process.env.DAILY_MOVEMENT_PROCESS_ID}`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('taskManagement.sentTask.createNewTask')}
            </Button>
          </Link>
        </div>
        
        <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.createdAt')}</TableHead>
                <TableHead>{t('common.createdBy')}</TableHead>
                <TableHead>{t('crm.factories.factoryName')}</TableHead>
                <TableHead>{t('common.type')}</TableHead>
                <TableHead>{t('common.detail')}</TableHead>
                <TableHead>{t('common.result')}</TableHead>
                <TableHead>{t('taskManagement.common.status')}</TableHead>
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
                          {formatDateToUTC7(row.created_at, 'date')}
                        </Link>
                      </TableCell>
                      <TableCell>{row.created_by}</TableCell>
                      <TableCell>{row.factory_name}</TableCell>
                      <TableCell className="border-r border-gray-300 whitespace-normal break-words max-w-[150px]">
                        {row.task_type}
                      </TableCell>
                      <TableCell className="border-r border-gray-300 whitespace-normal break-words max-w-[150px]">
                        {row.task_detail}
                      </TableCell>
                      <TableCell className="border-r border-gray-300 whitespace-normal break-words max-w-[150px]">
                        {row.result}
                        </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(row.state_type)}>
                          {row.state}
                        </Badge>
                      </TableCell>
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