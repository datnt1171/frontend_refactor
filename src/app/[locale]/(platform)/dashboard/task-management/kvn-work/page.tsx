import { getTechReportWorkYesterday } from "@/lib/api/server"
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
  
  const response = await getTechReportWorkYesterday(params)
  const rows = response.filter(row => row.salesman === "陳國勇")
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
                        colSpan={1} 
                        className="text-center font-semibold border-r-2 border-gray-300 bg-blue-100"
                      >
                        {t('crm.factories.onsite')}
                      </TableHead>
                      <TableHead 
                        colSpan={1} 
                        className="text-center font-semibold border-r-2 border-gray-300 bg-green-100"
                      >
                        {t('crm.factories.work')}
                      </TableHead>
                      <TableHead 
                        colSpan={1} 
                        className="text-center font-semibold border-r-2 border-gray-300 bg-red-100"
                      >
                        {t('user.absence')}
                      </TableHead>
                      <TableHead 
                        colSpan={1} 
                        className="text-center font-semibold border-r-2 border-gray-300 bg-yellow-100"
                      >
                        {t('crm.factories.support')}-
                      </TableHead>
                      <TableHead 
                        colSpan={4} 
                        className="text-center font-semibold border-r-2 border-gray-300 bg-blue-100"
                      >
                        {t('crm.factories.support')}+
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
                      <TableHead 
                        rowSpan={2} 
                        className="text-center text-sm bg-blue-50 border-r border-gray-300">
                        {t('common.file')}
                      </TableHead>
                    </TableRow>
                    
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-center text-sm bg-blue-50 border-r-2 border-gray-300">KVN</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r-2 border-gray-300">KVN</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r-2 border-gray-300">KVN</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r-2 border-gray-300">KVN</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-200">KVN</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-200">KTW</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-200">KTC</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r-2 border-gray-300">TT</TableHead>
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

                            {/* Onsite */}
                            <TableCell className="border-r-2 border-gray-300" style={getValueStyle(row.kvn_onsite)}>{row.kvn_onsite}</TableCell>

                            {/* Work */}
                            <TableCell className="border-r-2 border-gray-300" style={getValueStyle(
                              row.kvn_onsite - row.kvn_absence - row.kvn_out + row.kvn_in
                            )}>
                              {row.kvn_onsite - row.kvn_absence - row.kvn_out + row.kvn_in}
                            </TableCell>

                            {/* Absence */}
                            <TableCell className="border-r-2 border-gray-300" style={getValueStyle(-row.kvn_absence)}>{-row.kvn_absence}</TableCell>

                            {/* Out */}
                            <TableCell className="border-r-2 border-gray-300" style={getValueStyle(-row.kvn_out)}>{-row.kvn_out}</TableCell>

                            {/* In */}
                            <TableCell className="border-r border-gray-200" style={getValueStyle(row.kvn_in)}>{row.kvn_in}</TableCell>
                            <TableCell className="border-r border-gray-200" style={getValueStyle(row.ktw_in)}>{row.ktw_in}</TableCell>
                            <TableCell className="border-r border-gray-200" style={getValueStyle(row.ktc_in)}>{row.ktc_in}</TableCell>
                            <TableCell className="border-r-2 border-gray-300" style={getValueStyle(row.tt_in)}>{row.tt_in}</TableCell>

                            {/* Overtime */}
                            <TableCell className="border-r border-gray-300 whitespace-normal break-words max-w-[150px]">
                              {row.overtime.pallet_line_tomorrow}
                            </TableCell>
                            <TableCell className="border-r border-gray-300 whitespace-normal break-words max-w-[150px]">
                              {row.overtime.hanging_line_tomorrow}
                            </TableCell>
                            <TableCell className="border-r border-gray-300 whitespace-normal break-words max-w-[150px]">
                              {row.overtime.others_tomorrow}
                            </TableCell>

                            {/* Sample */}
                            <TableCell className="border-r border-gray-300">{row.sample_by_factory.quantity_requirement}</TableCell>
                            <TableCell className="border-r border-gray-300">
                              {row.overtime.files.length === 0 ? (
                                <span className="text-gray-400"></span>
                              ) : (
                                <div className="grid grid-rows-2 grid-flow-col gap-2 auto-cols-max">
                                  {row.overtime.files.map((file, idx) => (
                                    <a 
                                      key={idx} 
                                      href={file.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="hover:opacity-80"
                                    >
                                      <img 
                                        src={file.url} 
                                        alt={file.filename}
                                        className="w-20 h-20 object-cover rounded border"
                                      />
                                    </a>
                                  ))}
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}

                        {/* Summary Row 1: Individual Column Sums (KTW, KTC, KVN, TT) */}
                        <TableRow className="font-bold border-2 border-gray-300">
                          <TableCell colSpan={2} className="text-center border-r border-gray-300">{t('common.total')}</TableCell>
                          
                          {/* Onsite Sums */}
                          <TableCell className="text-center border-r-2 border-gray-300">{rows.reduce((sum, row) => sum + row.kvn_onsite, 0)}</TableCell>
                          
                          {/* Work Sums */}
                          <TableCell className="text-center border-r-2 border-gray-300">{rows.reduce((sum, row) => sum + (row.kvn_onsite - row.kvn_absence - row.kvn_out + row.kvn_in), 0)}</TableCell>
                          
                          {/* Absence Sums */}
                          <TableCell className="text-center border-r-2 border-gray-300">{rows.reduce((sum, row) => sum + (-row.kvn_absence), 0)}</TableCell>
                          
                          {/* Out Sums */}
                          <TableCell className="text-center border-r-2 border-gray-300">{rows.reduce((sum, row) => sum + (-row.kvn_out), 0)}</TableCell>
                          
                          {/* In Sums */}
                          <TableCell className="text-center border-r border-gray-200">{rows.reduce((sum, row) => sum + row.kvn_in, 0)}</TableCell>
                          <TableCell className="text-center border-r border-gray-200">{rows.reduce((sum, row) => sum + row.ktw_in, 0)}</TableCell>
                          <TableCell className="text-center border-r border-gray-200">{rows.reduce((sum, row) => sum + row.ktc_in, 0)}</TableCell>
                          <TableCell className="text-center border-r border-gray-200">{rows.reduce((sum, row) => sum + row.tt_in, 0)}</TableCell>
                          
                          {/* Other columns */}
                          <TableCell className="text-center border-r border-gray-200">-</TableCell>
                          <TableCell className="text-center border-r border-gray-200">-</TableCell>
                          <TableCell className="text-center border-r border-gray-200">-</TableCell>
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