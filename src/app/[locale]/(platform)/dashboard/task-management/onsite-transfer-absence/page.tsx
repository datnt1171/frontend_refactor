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
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Enhanced Version with Better Styling:</h3>
                
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead 
                        rowSpan={2} 
                        className="text-center font-semibold border-r-2 border-gray-300 align-middle"
                      >
                        Factory Code
                      </TableHead>
                      <TableHead 
                        rowSpan={2} 
                        className="text-center font-semibold border-r-2 border-gray-300 align-middle"
                      >
                        Factory Name
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
                        className="text-center font-semibold bg-green-100"
                      >
                        Work
                      </TableHead>
                      <TableHead 
                        colSpan={3} 
                        className="text-center font-semibold bg-red-100"
                      >
                        Absence
                      </TableHead>
                      <TableHead 
                        colSpan={3} 
                        className="text-center font-semibold bg-gray-100"
                      >
                        Out
                      </TableHead>
                      <TableHead 
                        colSpan={3} 
                        className="text-center font-semibold bg-green-100"
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
                      <TableHead className="text-center text-sm bg-green-50">KVN</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-200">KTW</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-200">KTC</TableHead>
                      <TableHead className="text-center text-sm bg-green-50">KVN</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-200">KTW</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-200">KTC</TableHead>
                      <TableHead className="text-center text-sm bg-green-50">KVN</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-200">KTW</TableHead>
                      <TableHead className="text-center text-sm bg-green-50 border-r border-gray-200">KTC</TableHead>
                      <TableHead className="text-center text-sm bg-green-50">KVN</TableHead>
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

                          <TableCell>{row.ktw_onsite}</TableCell>
                          <TableCell>{row.ktc_onsite}</TableCell>
                          <TableCell>{row.kvn_onsite}</TableCell>
                          {/*Change to current work */}
                          <TableCell>{row.ktw_onsite}</TableCell> 
                          <TableCell>{row.ktc_onsite}</TableCell>
                          <TableCell>{row.kvn_onsite}</TableCell>
                          {/*Change to current work */}

                          <TableCell>{row.ktw_absence}</TableCell>
                          <TableCell>{row.ktc_absence}</TableCell>
                          <TableCell>{row.kvn_absence}</TableCell>

                          <TableCell>{row.ktw_out}</TableCell>
                          <TableCell>{row.ktc_out}</TableCell>
                          <TableCell>{row.kvn_out}</TableCell>

                          <TableCell>{row.ktw_in}</TableCell>
                          <TableCell>{row.ktc_in}</TableCell>
                          <TableCell>{row.kvn_in}</TableCell>
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