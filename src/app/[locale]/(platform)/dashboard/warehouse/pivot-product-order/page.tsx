import { getPivotProductOrder, getMaxSalesDate } from '@/lib/api/server';
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
import { format, subYears } from 'date-fns'
import { CSVDownloadButton } from '@/components/ui/CSVDownloadButton'
import type { ColumnConfig } from '@/types'
import { redirectWithDefaults, getYearOptions, getMonthOptions, getFactoryOptions } from '@/lib/utils/filter';
import { DataStatusBadge } from '@/components/ui/DataStatusBadge';

interface PageProps {
  searchParams: Promise<{
    day__gte: string
    day__lte: string
    month: string
    year: string
    factory?: string
    increase: string
  }>
}

export default async function Page({ searchParams }: PageProps) {

  const params = await searchParams
  const locale = await getLocale()
  const t = await getTranslations()

  const maxSalesDate = await getMaxSalesDate()
  const today = new Date(maxSalesDate)


  const defaultParams = {
    day__gte: '1',
    day__lte: format(today, 'd'),
    month: '10,11,12',
    year: format(subYears(today, 1), 'yyyy'),
    increase: 'false'
  }

  redirectWithDefaults({
    currentParams: params,
    defaultParams,
    pathname: '/dashboard/warehouse/pivot-product-order',
    locale
  });

  const FilterConfig: PageFilterConfig = {
    showResetButton: false,
    autoApplyFilters: true,
    isPaginated: false,
    
    filters: [
      {
        id: 'factory',
        type: 'multiselect',
        label: t('filter.selectFactory'),
        placeholder: t('filter.selectFactory'),
        options: await getFactoryOptions()
      },
      {
        id: 'year',
        type: 'multiselect',
        label: t('filter.selectYear'),
        placeholder: t('filter.selectYear'),
        options: getYearOptions()
      },
      {
        id: 'month',
        type: 'multiselect',
        label: t('filter.selectMonth'),
        placeholder: t('filter.selectMonth'),
        options: await getMonthOptions()
      },
      {
        id: 'day',
        type: 'day-range',
        label: t('filter.selectDay'),
        placeholder: t('filter.selectDay'),
        highlightThreshold: today.getDate()
      },
      {
        id: 'increase',
        type: 'select',
        label: t('filter.sortBy'),
        placeholder: t('filter.sortBy'),
        options: [
          { value: 'true', label: t('filter.increase') },
          { value: 'false', label: t('filter.descrease') },
        ]
      },
    ]
  }

  const data = await getPivotProductOrder(params)

  const staticCols = ["product_code", "product_name", "factory_code", "factory_name", "total_order", "avg_order"]
  const ymCols = data.length > 0
    ? Object.keys(data[0]!).filter(k => !staticCols.includes(k)).sort()
    : []

  const pivotProductOrderColumns: ColumnConfig[] = [
    { key: 'factory_code', header: t('crm.factories.factoryId') },
    { key: 'factory_name', header: t('crm.factories.factoryName') },
    { key: 'product_code', header: t('product.productCode') },
    { key: 'product_name', header: t('product.productName') },
    { key: 'total_order', header: t('common.total') },
    { key: 'avg_order', header: t('common.average') },
    ...ymCols.map(col => ({ key: col, header: col })),
  ]

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />

        <DataStatusBadge date={maxSalesDate} />

        <div className="flex justify-end">
          <CSVDownloadButton
            data={data}
            columns={pivotProductOrderColumns}
            filename={"ĐĐH bất thường"}
            buttonText={t('common.download')}
          />
        </div>

        <div className="overflow-auto mt-2">
          <Table className="border border-gray-300">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-center font-semibold border-r border-gray-300">
                  {t('crm.factories.factoryId')}
                </TableHead>
                <TableHead className="text-center font-semibold border-r-2 border-gray-300">
                  {t('crm.factories.factoryName')}
                </TableHead>
                <TableHead className="text-center font-semibold border-r border-gray-300 sticky left-0 bg-gray-100 z-10">
                  {t('product.productCode')}
                </TableHead>
                <TableHead className="text-center font-semibold border-r border-gray-300 sticky left-[120px] bg-gray-100 z-10">
                  {t('product.productName')}
                </TableHead>

                <TableHead className="text-center font-semibold border-r border-gray-300 border-l-2 bg-green-50 min-w-[100px]">
                  {t('common.total')}
                </TableHead>
                <TableHead className="text-center font-semibold border-r border-gray-300 bg-yellow-50 min-w-[100px]">
                  {t('common.average')}
                </TableHead>

                {/* Dynamic year-month columns */}
                {ymCols.map(col => (
                  <TableHead key={col} className="text-center font-semibold border-r border-gray-200 bg-blue-50 min-w-[100px]">
                    {col}
                  </TableHead>
                ))}

              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((row, idx) => (
                <TableRow key={`${row.product_code}-${row.factory_code}-${idx}`}>
                  <TableCell className="border-r border-gray-300 text-center">
                    {row.factory_code}
                  </TableCell>
                  <TableCell className="border-r-2 border-gray-300">
                    {row.factory_name}
                  </TableCell>
                  <TableCell className="border-r border-gray-300 font-mono text-sm sticky left-0 bg-white z-10">
                    {row.product_code}
                  </TableCell>
                  <TableCell className="border-r border-gray-300 sticky left-[120px] bg-white z-10">
                    {row.product_name}
                  </TableCell>

                  <TableCell className="border-r border-gray-300 border-l-2 text-right font-semibold tabular-nums bg-green-50">
                    {row.total_order.toLocaleString()}
                  </TableCell>
                  <TableCell className="border-r border-gray-300 text-right tabular-nums bg-yellow-50">
                    {row.avg_order.toLocaleString()}
                  </TableCell>

                  {/* Dynamic year-month values */}
                  {ymCols.map(col => (
                    <TableCell key={col} className="border-r border-gray-200 text-right tabular-nums">
                      {row[col] === 0
                        ? <span className="text-gray-300">—</span>
                        : row[col]!.toLocaleString()
                      }
                    </TableCell>
                  ))}

                </TableRow>
              ))}

              {/* Summary row */}
              {/* <TableRow className="font-bold border-t-2 border-gray-300 bg-gray-50">
                <TableCell colSpan={4} className="text-center border-r-2 border-gray-300 sticky left-0 bg-gray-50">
                  {t('common.total')}
                </TableCell>
                {ymCols.map(col => (
                  <TableCell key={col} className="border-r border-gray-200 text-right tabular-nums">
                    {data.reduce((sum, row) => sum + (Number(row[col]) || 0), 0).toLocaleString()}
                  </TableCell>
                ))}
                <TableCell className="border-r border-gray-300 border-l-2 text-right tabular-nums bg-green-50">
                  {data.reduce((sum, row) => sum + row.total_order, 0).toLocaleString()}
                </TableCell>
                <TableCell className="border-r border-gray-300 text-right tabular-nums bg-yellow-50">
                  —
                </TableCell>
              </TableRow> */}
            </TableBody>
          </Table>
        </div>
      </SidebarInset>
      
      <SidebarRight filterConfig={FilterConfig} />
    </SidebarProvider>
  )
}