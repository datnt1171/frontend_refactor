import { getThinnerPaintRatio, getMaxSalesDate } from '@/lib/api/server';
import { getTranslations, getLocale } from "next-intl/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import type { PageFilterConfig } from "@/types"
import { getCurrentYear } from '@/lib/utils/date'
import { getYearOptions, THINNER_PAINT_OPTIONS, redirectWithDefaults } from '@/lib/utils/filter'
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
import { DataStatusBadge } from '@/components/ui/DataStatusBadge';

interface PageProps {
  searchParams: Promise<{
    year: string,
    thinner: string,
    paint: string,
    table: string
  }>
}

export default async function Page({ searchParams }: PageProps) {

  const params = await searchParams
  const locale = await getLocale()
  const t = await getTranslations()

  const defaultParams = {
    table: ['ratio'].join(','),
    year: getCurrentYear(),
    thinner: ['原料溶劑 NL DUNG MOI', '成品溶劑DUNG MOI TP'].join(','),
    paint: ['烤調色PM HAP', '木調色PM GO', '底漆 LOT', '面漆 BONG'].join(','),
  }

  redirectWithDefaults({
    currentParams: params,
    defaultParams,
    pathname: '/dashboard/warehouse/ratio',
    locale
  });

  const FilterConfig: PageFilterConfig = {
    showResetButton: false,
    autoApplyFilters: true,
    isPaginated: false,
    filters: [
      {
        id: 'table',
        type: 'multiselect',
        label: t('filter.table'),
        placeholder: t('filter.selectTable'),
        options: [
          { value: 'ratio',          label: t('product.ratio') },
          { value: 'thinner',        label: t('product.thinner') },
          { value: 'paint',          label: t('product.paint') },
          { value: 'thinner_detail', label: `${t('product.thinner')} (${t('common.detail')})` },
          { value: 'paint_detail',   label: `${t('product.paint')} (${t('common.detail')})` },
        ]
      },
      {
        id: 'year',
        type: 'select',
        label: t('filter.selectYear'),
        placeholder: t('filter.selectYear'),
        options: getYearOptions()
      },
      {
        id: 'thinner',
        type: 'multiselect',
        label: t('product.thinner'),
        placeholder: t('product.thinner'),
        options: THINNER_PAINT_OPTIONS
      },
      {
        id: 'paint',
        type: 'multiselect',
        label: t('product.paint'),
        placeholder: t('product.paint'),
        options: THINNER_PAINT_OPTIONS
      },
    ]
  }

  const maxSalesDate = await getMaxSalesDate()
  const thinnerPaintRatio = await getThinnerPaintRatio(params)

  const selectedTables = params.table
    ? params.table.split(',').map(t => t.trim())
    : ['ratio']

  const showRatio         = selectedTables.includes('ratio')
  const showThinner       = selectedTables.includes('thinner')
  const showPaint         = selectedTables.includes('paint')
  const showThinnerDetail = selectedTables.includes('thinner_detail')
  const showPaintDetail   = selectedTables.includes('paint_detail')

  // Month columns from summary data
  const monthColumns = thinnerPaintRatio.thinner_data[0]
    ? Object.keys(thinnerPaintRatio.thinner_data[0])
        .filter(key => key !== 'factory_code' && key !== 'factory_name')
        .sort((a, b) => Number(a) - Number(b))
    : []

  // Month columns from detail data (excludes extra index cols)
  const detailExcludedKeys = new Set(['factory_code', 'factory_name', 'product_type', 'product_name'])
  const detailMonthColumns = thinnerPaintRatio.thinner_detail_data[0]
    ? Object.keys(thinnerPaintRatio.thinner_detail_data[0])
        .filter(key => !detailExcludedKeys.has(key))
        .sort((a, b) => Number(a) - Number(b))
    : monthColumns

  const createSummaryColumns = (months: string[]): ColumnConfig[] => [
    { key: 'factory_code', header: t('crm.factories.factoryId') },
    { key: 'factory_name', header: t('crm.factories.factoryName') },
    ...months.map(month => ({ key: month, header: `${month}` }))
  ]

  const createDetailColumns = (months: string[]): ColumnConfig[] => [
    { key: 'factory_code',  header: t('crm.factories.factoryId') },
    { key: 'factory_name',  header: t('crm.factories.factoryName') },
    { key: 'product_type',  header: t('product.productType') },
    { key: 'product_name',  header: t('product.productName') },
    ...months.map(month => ({ key: month, header: `${month}` }))
  ]

  const thinnerColumns       = createSummaryColumns(monthColumns)
  const paintColumns         = createSummaryColumns(monthColumns)
  const thinnerDetailColumns = createDetailColumns(detailMonthColumns)
  const paintDetailColumns   = createDetailColumns(detailMonthColumns)

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />
        <DataStatusBadge date={maxSalesDate} />

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
                filename="thinner"
                buttonText={t('common.download')}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('crm.factories.factoryId')}</TableHead>
                  <TableHead>{t('crm.factories.factoryName')}</TableHead>
                  {monthColumns.map(month => <TableHead key={month}>{month}</TableHead>)}
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
                filename="paint"
                buttonText={t('common.download')}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('crm.factories.factoryId')}</TableHead>
                  <TableHead>{t('crm.factories.factoryName')}</TableHead>
                  {monthColumns.map(month => <TableHead key={month}>{month}</TableHead>)}
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

        {/* Thinner Detail Table */}
        {showThinnerDetail && (
          <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto mb-4">
            <div className="flex items-center justify-between px-4 py-2">
              <h3 className="font-semibold">{t('product.thinner')} ({t('common.detail')})</h3>
              <CSVDownloadButton
                data={thinnerPaintRatio.thinner_detail_data}
                columns={thinnerDetailColumns}
                filename="thinner-detail"
                buttonText={t('common.download')}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('crm.factories.factoryId')}</TableHead>
                  <TableHead>{t('crm.factories.factoryName')}</TableHead>
                  <TableHead>{t('product.productType')}</TableHead>
                  <TableHead>{t('product.productName')}</TableHead>
                  {detailMonthColumns.map(month => <TableHead key={month}>{month}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {thinnerPaintRatio.thinner_detail_data.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{String(row.factory_code ?? '')}</TableCell>
                    <TableCell>{String(row.factory_name ?? '')}</TableCell>
                    <TableCell>{String(row.product_type ?? '')}</TableCell>
                    <TableCell>{String(row.product_name ?? '')}</TableCell>
                    {detailMonthColumns.map(month => (
                      <TableCell key={month}>{String(row[month] ?? 0)}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Paint Detail Table */}
        {showPaintDetail && (
          <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto mb-4">
            <div className="flex items-center justify-between px-4 py-2">
              <h3 className="font-semibold">{t('product.paint')} ({t('common.detail')})</h3>
              <CSVDownloadButton
                data={thinnerPaintRatio.paint_detail_data}
                columns={paintDetailColumns}
                filename="paint-detail"
                buttonText={t('common.download')}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('crm.factories.factoryId')}</TableHead>
                  <TableHead>{t('crm.factories.factoryName')}</TableHead>
                  <TableHead>{t('product.productType')}</TableHead>
                  <TableHead>{t('product.productName')}</TableHead>
                  {detailMonthColumns.map(month => <TableHead key={month}>{month}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {thinnerPaintRatio.paint_detail_data.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{String(row.factory_code ?? '')}</TableCell>
                    <TableCell>{String(row.factory_name ?? '')}</TableCell>
                    <TableCell>{String(row.product_type ?? '')}</TableCell>
                    <TableCell>{String(row.product_name ?? '')}</TableCell>
                    {detailMonthColumns.map(month => (
                      <TableCell key={month}>{String(row[month] ?? 0)}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

      </SidebarInset>
      <SidebarRight filterConfig={FilterConfig} />
    </SidebarProvider>
  )
}