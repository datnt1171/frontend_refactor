import { getOnsiteTransferAbsences } from "@/lib/api/server"
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

const FilterConfig: PageFilterConfig = {
  showResetButton: true,
  defaultValues: {
    date: new Date().toISOString().split('T')[0]
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
  
  const response = await getOnsiteTransferAbsences(params)
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
              
              <div className="flex justify-end">
                  <ScreenshotButton 
                    targetId="table-report" 
                    filename="table-screenshot.png" 
                  />
              </div>
              <div id="table-container" className="overflow-auto mt-8">
                <Table id="table-report">
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead 
                        rowSpan={2} 
                        className="text-center font-semibold border-r-2 border-gray-300 align-middle"
                      >
                        Code
                      </TableHead>
                      <TableHead 
                        rowSpan={2} 
                        className="text-center font-semibold border-r-2 border-gray-300 align-middle"
                      >
                        Name
                      </TableHead>
                      <TableHead 
                        rowSpan={2} 
                        className="text-center font-semibold border-r-2 border-gray-300 align-middle"
                      >
                        Salesman
                      </TableHead>
                      <TableHead 
                        colSpan={3} 
                        className="text-center font-semibold border-r-2 border-gray-300 bg-blue-100"
                      >
                        Onsite
                      </TableHead>
                      <TableHead 
                        colSpan={3} 
                        className="text-center font-semibold border-r-2 border-gray-300 bg-green-100"
                      >
                        Work
                      </TableHead>
                      <TableHead 
                        colSpan={3} 
                        className="text-center font-semibold border-r-2 border-gray-300 bg-red-100"
                      >
                        Absence
                      </TableHead>
                      <TableHead 
                        colSpan={3} 
                        className="text-center font-semibold border-r-2 border-gray-300 bg-yellow-100"
                      >
                        Out
                      </TableHead>
                      <TableHead 
                        colSpan={4} 
                        className="text-center font-semibold border-r-2 border-gray-300 bg-blue-100"
                      >
                        In
                      </TableHead>
                    </TableRow>
                    
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-center text-sm bg-blue-50 border-r border-gray-200">KTW</TableHead>
                      <TableHead className="text-center text-sm bg-blue-50 border-r border-gray-200">KTC</TableHead>
                      <TableHead className="text-center text-sm bg-blue-50 border-r-2 border-gray-300">KVN</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-200">KTW</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-200">KTC</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-300">KVN</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-200">KTW</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-200">KTC</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-300">KVN</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-200">KTW</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-200">KTC</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-300">KVN</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-200">KTW</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-200">KTC</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-300">KVN</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-300">TT</TableHead>
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
                        <TableRow key={row.factory_code}>
                          <TableCell>{row.factory_code}</TableCell>
                          <TableCell>{row.factory_name}</TableCell>
                          <TableCell>{row.factory_code}</TableCell>

                          {/* Onsite */}
                          <TableCell style={getValueStyle(row.ktw_onsite)}>{row.ktw_onsite}</TableCell>
                          <TableCell style={getValueStyle(row.ktc_onsite)}>{row.ktc_onsite}</TableCell>
                          <TableCell style={getValueStyle(row.kvn_onsite)}>{row.kvn_onsite}</TableCell>

                          {/* Onsite */}
                          <TableCell style={getValueStyle(row.ktw_onsite)}>{row.ktw_onsite}</TableCell>
                          <TableCell style={getValueStyle(row.ktc_onsite)}>{row.ktc_onsite}</TableCell>
                          <TableCell style={getValueStyle(row.kvn_onsite)}>{row.kvn_onsite}</TableCell>

                          {/* Absence */}
                          <TableCell style={getValueStyle(-row.ktw_absence)}>{-row.ktw_absence}</TableCell>
                          <TableCell style={getValueStyle(-row.ktc_absence)}>{-row.ktc_absence}</TableCell>
                          <TableCell style={getValueStyle(-row.kvn_absence)}>{-row.kvn_absence}</TableCell>

                          {/* Out */}
                          <TableCell style={getValueStyle(-row.ktw_out)}>{-row.ktw_out}</TableCell>
                          <TableCell style={getValueStyle(-row.ktc_out)}>{-row.ktc_out}</TableCell>
                          <TableCell style={getValueStyle(-row.kvn_out)}>{-row.kvn_out}</TableCell>

                          {/* In */}
                          <TableCell style={getValueStyle(row.ktw_in)}>{row.ktw_in}</TableCell>
                          <TableCell style={getValueStyle(row.ktc_in)}>{row.ktc_in}</TableCell>
                          <TableCell style={getValueStyle(row.kvn_in)}>{row.kvn_in}</TableCell>
                          <TableCell style={getValueStyle(row.tt_in)}>{row.tt_in}</TableCell>
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