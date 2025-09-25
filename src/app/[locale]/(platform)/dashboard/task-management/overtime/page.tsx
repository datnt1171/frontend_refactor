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
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import type { PageFilterConfig } from "@/types"
import { formatDateToUTC7 } from "@/lib/utils/date"
import { timeDiff } from "@/lib/utils/time"
import { DownloadCSVButtons } from "./DownloadCSV"

const FilterConfig: PageFilterConfig = {
  showResetButton: true,
  defaultValues: {
    date: new Date().toISOString().split('T')[0]
  },
  filters: []
}

interface PageProps {
  searchParams: Promise<{
    date: string
  }>
}

export default async function UserListPage({ searchParams }: PageProps) {
  const t = await getTranslations()
  const params = await searchParams
  
  const response = await getOvertimes(params)
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
              
              {/* Add download button */}
              <div className="flex justify-end mb-4">
                <DownloadCSVButtons data={rows} />
              </div>
              
              <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Created_at</TableHead>
                      <TableHead>Factory code</TableHead>
                      <TableHead>Factory name</TableHead>
                      <TableHead>OT start</TableHead>
                      <TableHead>OT end</TableHead>
                      <TableHead>OT num</TableHead>
                      <TableHead>Pallet</TableHead>
                      <TableHead>Hanging</TableHead>
                      <TableHead>total OT</TableHead>
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
                        <TableRow key={row.name_of_customer}>
                          <TableCell>{formatDateToUTC7(row.created_at,'date')}</TableCell>
                          <TableCell>{row.name_of_customer}</TableCell>
                          <TableCell>{row.factory_name}</TableCell>
                          <TableCell>{row.weekday_ot_start}</TableCell>
                          <TableCell>{row.weekday_ot_end}</TableCell>
                          <TableCell>{row.weekday_ot_num}</TableCell>
                          <TableCell>{row.pallet_line_today}</TableCell>
                          <TableCell>{row.hanging_line_today}</TableCell>
                          <TableCell>{timeDiff(row.weekday_ot_start, row.weekday_ot_end) * row.weekday_ot_num}</TableCell>
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