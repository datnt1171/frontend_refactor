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
import { CSVDownloadButton } from '@/components/ui/CSVDownloadButton'
import type { ColumnConfig } from '@/types'
import { RatioTableWithSelect } from './RatioTableWithSelect';

interface PageProps {
  searchParams: Promise<{
    year: string,
    thinner: string,
    paint: string,
    table: string
  }>
}

export default async function Page({ searchParams }: PageProps) {

  const t = await getTranslations()

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
        label: t('filter.table'),
        options: [
          { value: 'ratio', label: t('product.ratio') },
          { value: 'thinner', label: t('product.thinner') },
          { value: 'paint', label: t('product.paint') },
        ]
      },
      {
        id: 'year',
        type: 'select',
        label: t('filter.selectYear'),
        options: getYearOptions()
      },
      {
        id: 'thinner',
        type: 'multiselect',
        label: t('product.thinner'),
        options: THINNER_PAINT_OPTIONS
      },
      {
        id: 'paint',
        type: 'multiselect',
        label: t('product.paint'),
        options: THINNER_PAINT_OPTIONS
      },
    ]
  }

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

  const createThinnerPaintColumns = (monthColumns: string[]): ColumnConfig[] => [
    { key: 'factory_code', header: t('crm.factories.factoryId') },
    { key: 'factory_name', header: t('crm.factories.factoryName') },
    ...monthColumns.map(month => ({
      key: month,
      header: `${month}`
    }))
  ]

  const thinnerColumns = createThinnerPaintColumns(monthColumns)
  const paintColumns = createThinnerPaintColumns(monthColumns)

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
                <RatioTableWithSelect
                  data={thinnerPaintRatio}
                  monthColumns={monthColumns}
                />
              )}

              {/* Thinner Table */}
              {showThinner && (
                <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto mb-4">
                  <div className="flex items-center justify-between px-4 py-2">
                    <h3 className="font-semibold">{t('product.thinner')}</h3>
                    <CSVDownloadButton
                      data={thinnerPaintRatio.thinner_data}
                      columns={thinnerColumns}
                      filename={'thinner'}
                      buttonText={t('common.download')}
                    />
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('crm.factories.factoryId')}</TableHead>
                        <TableHead>{t('crm.factories.factoryName')}</TableHead>
                        {monthColumns.map(month => (
                          <TableHead key={month}>{month}</TableHead>
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
                  <div className="flex items-center justify-between px-4 py-2">
                    <h3 className="font-semibold">{t('product.paint')}</h3>
                    <CSVDownloadButton
                      data={thinnerPaintRatio.paint_data}
                      columns={paintColumns}
                      filename={'paint'}
                      buttonText={t('common.download')}
                    />
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('crm.factories.factoryId')}</TableHead>
                        <TableHead>{t('crm.factories.factoryName')}</TableHead>
                        {monthColumns.map(month => (
                          <TableHead key={month}>{month}</TableHead>
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