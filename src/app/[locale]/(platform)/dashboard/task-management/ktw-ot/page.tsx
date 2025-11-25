import { getTechReport } from "@/lib/api/server"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { getTranslations, getLocale } from "next-intl/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import type { PageFilterConfig } from "@/types"
import { ScreenshotButton } from "@/components/ui/ScreenshotButton"
import { format, addDays } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { Link } from "@/i18n/navigation"
import { redirectWithDefaults } from "@/lib/utils/filter"

interface PageProps {
  searchParams: Promise<{
    date: string
  }>
}

export default async function Page({ searchParams }: PageProps) {

  const params = await searchParams
  const locale = await getLocale()
  const t = await getTranslations()

  const defaultParams = {
    date: format(toZonedTime(new Date(), 'Asia/Ho_Chi_Minh'), 'yyyy-MM-dd'),
  }

  redirectWithDefaults({
    currentParams: params,
    defaultParams,
    pathname: '/dashboard/task-management/ktw-ot',
    locale
  });

  const FilterConfig: PageFilterConfig = {
    showResetButton: false,
    autoApplyFilters: true,

    filters: [
      {
        id: 'date',
        type: 'date',
        label: t('filter.selectDate')
      },
    ]
  }

  
  let isSaturday = false;
  let nextDate = '';
  
  if (params.date) {
    const paramsDate = new Date(params.date)
    isSaturday = paramsDate.getDay() === 6
    nextDate = format(addDays(new Date(params.date), 1), 'yyyy-MM-dd')
  }

  const response = await getTechReport(params)
  const rows = response.filter(row => row.salesman !== "陳國勇")

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />

        <div className="flex justify-end">
          <ScreenshotButton 
            targetId="table-report" 
            filename="table-screenshot.png" 
            imageTitle={params.date}
            buttonText={t('common.today')}
          />
        </div>
        <div className="overflow-auto mt-2">
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
                      <TableCell className="border border-gray-300 font-bold">
                        <Link href={`/task-management/tasks/${row.overtime.task_id}`} className="hover:underline">
                          {row.factory_code}
                        </Link>
                      </TableCell>
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
                      <TableCell className={`border-r border-gray-300 whitespace-normal break-words max-w-[150px] ${row.overtime.pallet_line_today !== '-' && row.overtime.pallet_line_today !== '' ? 'bg-red-100' : ''}`}>
                        {row.overtime.pallet_line_today}
                      </TableCell>
                      <TableCell className={`border-r border-gray-300 whitespace-normal break-words max-w-[150px] ${row.overtime.hanging_line_today !== '-' && row.overtime.hanging_line_today !== '' ? 'bg-red-100' : ''}`}>
                        {row.overtime.hanging_line_today}
                      </TableCell>
                      <TableCell className={`border-r border-gray-300 whitespace-normal break-words max-w-[150px] ${row.overtime.others_today !== '-' && row.overtime.others_today !== '' ? 'bg-red-100' : ''}`}>
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
            
        {isSaturday && (
          <>
            <div className="flex justify-end mt-4">
              <ScreenshotButton 
                targetId="sunday-report" 
                filename="sunday-report.png" 
                imageTitle={nextDate}
                buttonText={t('common.sunday')}
              />
            </div>
            <div className="overflow-auto mt-2">
              <Table id="sunday-report" className="border border-gray-300">
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
                          <TableCell className={`text-center border-r border-gray-300 ${row.overtime.sunday_ot_end !== '-' && row.overtime.sunday_ot_end !== '' ? 'bg-red-100' : ''}`}>
                            {row.overtime.sunday_ot_end === '-' 
                              ? 'KCN' 
                              : row.overtime.sunday_ot_end === '' 
                                ? 'KTC' 
                                : row.overtime.sunday_ot_end}
                          </TableCell>
                          <TableCell className={`text-center border-r border-gray-300 ${row.overtime.sunday_ot_num !== 0 && row.overtime.sunday_ot_num ? 'bg-red-100' : ''}`}>
                            {row.overtime.sunday_ot_num == 0 ? '' : row.overtime.sunday_ot_num}
                          </TableCell>
                          <TableCell className={`border-r border-gray-300 ${row.overtime.pallet_line_sunday !== '-' && row.overtime.pallet_line_sunday !== '' ? 'bg-red-100' : ''}`}>
                            {row.overtime.pallet_line_sunday}
                          </TableCell>
                          <TableCell className={`border-r border-gray-300 ${row.overtime.hanging_line_sunday !== '-' && row.overtime.hanging_line_sunday !== '' ? 'bg-red-100' : ''}`}>
                            {row.overtime.hanging_line_sunday}
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
                        <TableCell className="text-center border-r border-gray-200">{rows.reduce((sum, row) => sum + row.sample_by_factory.quantity_requirement, 0)}</TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </SidebarInset>
      
      <SidebarRight filterConfig={FilterConfig} />
    </SidebarProvider>
  )
}