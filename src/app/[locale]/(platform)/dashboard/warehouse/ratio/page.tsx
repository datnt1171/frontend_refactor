import { getThinnerPaintRatio } from '@/lib/api/server';
import { getTranslations } from "next-intl/server"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import type { PageFilterConfig } from "@/types"
import { getCurrentYear } from '@/lib/utils/date'
import { getYearOptions, THINNER_PAINT_OPTIONS } from '@/lib/utils/filter'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"

interface PageProps {
  searchParams: Promise<{
    year: string,
    thinner: string,
    paint: string,
    table: string
  }>
}

export default async function Page({ searchParams }: PageProps) {

  const FilterConfig: PageFilterConfig = {
    showResetButton: false,
      defaultValues: {
      table: ['ratio'],
      year: getCurrentYear(),
      thinner: ['原料溶劑 NL DUNG MOI', '成品溶劑DUNG MOI TP'],
      paint: ['烤調色PM HAP', '木調色PM GO', '底漆 LOT', '面漆 BONG'],
    },
    isPaginated: false,
    filters: [
      {
        id: 'table',
        type: 'multiselect',
        label: "Table",
        options: [
          { value: 'ratio', label: 'Ratio' },
          { value: 'thinner', label: 'Thinner' },
          { value: 'paint', label: 'Paint' },
        ]
      },
      {
        id: 'year',
        type: 'select',
        label: 'Year',
        options: getYearOptions()
      },
      {
        id: 'thinner',
        type: 'multiselect',
        label: 'Thinner',
        options: THINNER_PAINT_OPTIONS
      },
      {
        id: 'paint',
        type: 'multiselect',
        label: 'Paint',
        options: THINNER_PAINT_OPTIONS
      },
    ]
  }

  const t = await getTranslations()
  const params = await searchParams

  const thinnerPaintRatio = await getThinnerPaintRatio(params)

  // Parse multiselect table parameter
  const selectedTables = params.table 
    ? params.table.split(',').map(t => t.trim()) 
    : ['ratio']

  const showThinner = selectedTables.includes('thinner')
  const showPaint = selectedTables.includes('paint')
  const showRatio = selectedTables.includes('ratio')

  // Extract month columns dynamically from first row
  const monthColumns = thinnerPaintRatio.thinner_data[0] 
    ? Object.keys(thinnerPaintRatio.thinner_data[0])
        .filter(key => key !== 'factory_code' && key !== 'factory_name')
        .sort((a, b) => Number(a) - Number(b))
    : []

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
              
              {/* Ratio Table */}
              {showRatio && (
                <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
                  <h3 className="px-4 py-2 font-semibold">Ratio Data</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Factory Code</TableHead>
                        <TableHead>Factory Name</TableHead>
                        {monthColumns.map(month => (
                          <TableHead key={month}>Month {month}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {thinnerPaintRatio.ratio_data.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{String(row.factory_code ?? '')}</TableCell>
                          <TableCell>{String(row.factory_name ?? '')}</TableCell>
                          {monthColumns.map(month => (
                            <TableCell key={month}>{String(row[month] ?? 0)}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Thinner Table */}
              {showThinner && (
                <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto mb-4">
                  <h3 className="px-4 py-2 font-semibold">Thinner Data</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Factory Code</TableHead>
                        <TableHead>Factory Name</TableHead>
                        {monthColumns.map(month => (
                          <TableHead key={month}>Month {month}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {thinnerPaintRatio.thinner_data.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{String(row.factory_code ?? '')}</TableCell>
                          <TableCell>{String(row.factory_name ?? '')}</TableCell>
                          {monthColumns.map(month => (
                            <TableCell key={month}>{String(row[month] ?? 0)}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Paint Table */}
              {showPaint && (
                <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto mb-4">
                  <h3 className="px-4 py-2 font-semibold">Paint Data</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Factory Code</TableHead>
                        <TableHead>Factory Name</TableHead>
                        {monthColumns.map(month => (
                          <TableHead key={month}>Month {month}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {thinnerPaintRatio.paint_data.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{String(row.factory_code ?? '')}</TableCell>
                          <TableCell>{String(row.factory_name ?? '')}</TableCell>
                          {monthColumns.map(month => (
                            <TableCell key={month}>{String(row[month] ?? 0)}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
          <SidebarRight filterConfig={FilterConfig} />
        </div>
      </SidebarProvider>
    </RightSidebarProvider>
  )
}