import { getTechReport } from "@/lib/api/server"
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
import { getValueStyle } from '@/lib/utils/format'
import { ScreenshotButton } from "@/components/ui/ScreenshotButton"
import { timeDiff } from "@/lib/utils/time"
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

const FilterConfig: PageFilterConfig = {
  showResetButton: true,
  defaultValues: {
    date: format(toZonedTime(new Date(), 'Asia/Ho_Chi_Minh'), 'yyyy-MM-dd')
  },
  filters: [
    {
      id: 'date',
      type: 'date',
      label: 'Select Date'
    },
  ]
}

interface PageProps {
  searchParams: Promise<{
    date: string
  }>
}

export default async function Page({ searchParams }: PageProps) {
  const t = await getTranslations()
  const params = await searchParams
  
  const response = await getTechReport(params)
  const rows = response.filter(row => row.salesman !== "陳國勇")
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
              
              <div className="flex justify-end">
                  <ScreenshotButton 
                    targetId="table-report" 
                    filename="table-screenshot.png" 
                    imageTitle={params.date}
                  />
              </div>
              <div id="table-container" className="overflow-auto mt-2">
                <Table id="table-report" className="border border-gray-300">
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead 
                        rowSpan={2} 
                        className="text-center font-semibold border-r-2 border-gray-300 align-middle"
                      >
                        {t('crm.factories.factoryId')}
                      </TableHead>
                      <TableHead 
                        rowSpan={2} 
                        className="text-center font-semibold border-r-2 border-gray-300 align-middle"
                      >
                        {t('crm.factories.factoryName')}
                      </TableHead>
                      <TableHead 
                        rowSpan={2} 
                        className="text-center text-sm bg-blue-50 border-r border-gray-200">
                        {t('user.overtimeEnd')}
                      </TableHead>
                      <TableHead 
                        rowSpan={2} 
                        className="text-center text-sm bg-blue-50 border-r border-gray-300">
                        {t('user.overtimeNum')}
                      </TableHead>
                      <TableHead 
                        rowSpan={2} 
                        className="text-center text-sm bg-blue-50 border-r border-gray-300">
                        {t('blueprint.pallet')}
                      </TableHead>
                      <TableHead 
                        rowSpan={2} 
                        className="text-center text-sm bg-blue-50 border-r border-gray-300">
                        {t('blueprint.hanging')}
                      </TableHead>
                      <TableHead 
                        rowSpan={2} 
                        className="text-center text-sm bg-blue-50 border-r border-gray-300">
                        {t('common.others')}
                      </TableHead>
                      <TableHead 
                        rowSpan={2} 
                        className="text-center text-sm bg-blue-50 border-r border-gray-300">
                        {t('sample.sample')}
                      </TableHead>
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
                      <>
                        {rows.map((row) => (
                          <TableRow key={row.factory_code}>
                            <TableCell className="border border-gray-300">{row.factory_code}</TableCell>
                            <TableCell className="border-r-2 border-gray-300">{row.factory_name}</TableCell>

                            {/* Overtime */}
                            <TableCell className={`text-center border-r border-gray-300 ${row.overtime.weekday_ot_end !== '-' && row.overtime.weekday_ot_end !== '' ? 'bg-red-100' : ''}`}>
                              {row.overtime.weekday_ot_end === '-' 
                                ? 'KCN' 
                                : row.overtime.weekday_ot_end === '' 
                                  ? 'KTC' 
                                  : row.overtime.weekday_ot_end}
                            </TableCell>
                            <TableCell className={`text-center border-r border-gray-300 ${row.overtime.weekday_ot_num !== 0 && row.overtime.weekday_ot_num ? 'bg-red-100' : ''}`}>
                              {row.overtime.weekday_ot_num == 0 ? '' : row.overtime.weekday_ot_num}
                            </TableCell>
                            <TableCell className={`border-r border-gray-300 ${row.overtime.pallet_line_today !== '-' && row.overtime.pallet_line_today !== '' ? 'bg-red-100' : ''}`}>
                              {row.overtime.pallet_line_today}
                            </TableCell>
                            <TableCell className={`border-r border-gray-300 ${row.overtime.hanging_line_today !== '-' && row.overtime.hanging_line_today !== '' ? 'bg-red-100' : ''}`}>
                              {row.overtime.hanging_line_today}
                            </TableCell>
                            <TableCell className={`border-r border-gray-300 ${row.overtime.others_today !== '-' && row.overtime.others_today !== '' ? 'bg-red-100' : ''}`}>
                              {row.overtime.others_today}
                            </TableCell>

                            {/* Sample */}
                            <TableCell className={`text-center border-r border-gray-300 ${row.sample_by_factory.quantity_requirement !== 0 && row.sample_by_factory.quantity_requirement ? 'bg-red-100' : ''}`}>
                              {row.sample_by_factory.quantity_requirement}
                            </TableCell>
                          </TableRow>
                        ))}

                        {/* Summary Row 1: Individual Column Sums (KTW, KTC, KVN, TT) */}
                        <TableRow className="font-bold border-2 border-gray-300">
                          <TableCell colSpan={2} className="text-center border-r border-gray-300">{t('common.total')}</TableCell>
                          
                          <TableCell className="text-center border-r border-gray-200">-</TableCell>
                          <TableCell className="text-center border-r border-gray-200">
                            {rows.reduce((sum, row) => sum + Number(row.overtime.weekday_ot_num), 0)}
                          </TableCell>

                          {/* Other columns */}
                          <TableCell className="border-r border-gray-200">-</TableCell>
                          <TableCell className="border-r border-gray-200">-</TableCell>
                          <TableCell className="border-r border-gray-200">-</TableCell>
                          <TableCell className="text-center border-r border-gray-200">{rows.reduce((sum, row) => sum + row.sample_by_factory.quantity_requirement, 0)}</TableCell>
                        </TableRow>
                      </>
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