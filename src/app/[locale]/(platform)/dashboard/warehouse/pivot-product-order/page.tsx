import React from 'react';
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
    selected_month: string
    selected_year: string
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
    increase: 'false',
    selected_month: format(today, 'M'),
    selected_year: format(today, 'yyyy'),
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
        label: t('filter.targetYear'),
        placeholder: t('filter.targetYear'),
        options: getYearOptions()
      },
      {
        id: 'month',
        type: 'multiselect',
        label: t('filter.targetMonth'),
        placeholder: t('filter.targetMonth'),
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
        id: 'selected_month',
        type: 'select',
        label: t('filter.selectMonth'),
        placeholder: t('filter.selectMonth'),
        options: await getMonthOptions()
      },
      {
        id: 'selected_year',
        type: 'select',
        label: t('filter.selectYear'),
        placeholder: t('filter.selectYear'),
        options: getYearOptions()
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

  const staticCols = ["factory_code", "factory_name", "product_code", "product_name", "total_sales", "avg_sales", "selected_month_sales", "planned_deliveries"]
  const ymCols = data.length > 0
    ? Object.keys(data[0]!).filter(k => !staticCols.includes(k)).sort()
    : []

  const pivotProductOrderColumns: ColumnConfig[] = [
    { key: 'factory_code', header: t('crm.factories.factoryId') },
    { key: 'factory_name', header: t('crm.factories.factoryName') },
    { key: 'product_code', header: t('product.productCode') },
    { key: 'product_name', header: t('product.productName') },
    { key: 'total_sales', header: t('common.total') },
    { key: 'avg_sales', header: t('common.average') },
    { key: 'selected_month_sales', header: t('dashboard.sales.sales') },
    { key: 'planned_deliveries', header: t('dashboard.sideBar.pendingDelivery') },
    ...ymCols.map(col => ({ key: col, header: col })),
  ]

  // Group data by factory_code
  const factoryGroups = data.reduce((acc, row) => {
    if (!acc[row.factory_code]) acc[row.factory_code] = []
    acc[row.factory_code]!.push(row)
    return acc
  }, {} as Record<string, typeof data>)

  const pct = (val: number, avg: number) =>
    avg > 0 ? ` (${((val / avg) * 100).toFixed(1)}%)` : ''

  const csvData = Object.entries(factoryGroups).flatMap(([factoryCode, rows]) => {
    const sumTotal = rows.reduce((s, r) => s + r.total_sales, 0)
    const sumAvg = rows.reduce((s, r) => s + r.avg_sales, 0)
    const sumSelected = rows.reduce((s, r) => s + r.selected_month_sales, 0)
    const sumPlanned = rows.reduce((s, r) => s + r.planned_deliveries, 0)

    const summaryRow = {
      factory_code: factoryCode,
      factory_name: rows[0]!.factory_name,
      product_code: t('common.total'),
      product_name: '',
      total_sales: sumTotal,
      avg_sales: Math.round(sumAvg),
      selected_month_sales: sumSelected,
      planned_deliveries: sumPlanned,
      ...Object.fromEntries(
        ymCols.map(col => [col, rows.reduce((s, r) => s + (Number(r[col]) || 0), 0)])
      ),
    }

    const pctRow = {
      factory_code: factoryCode,
      factory_name: rows[0]!.factory_name,
      product_code: t('common.total') + ' %',
      product_name: '',
      total_sales: '',
      avg_sales: '',
      selected_month_sales: sumAvg > 0 ? parseFloat(((sumSelected / sumAvg) * 100).toFixed(1)) : '',
      planned_deliveries: sumAvg > 0 ? parseFloat((((sumSelected + sumPlanned) / sumAvg) * 100).toFixed(1)) : '',
      ...Object.fromEntries(ymCols.map(col => [col, ''])),
    }

    return [...rows, summaryRow, pctRow]
  })

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />

        <DataStatusBadge date={maxSalesDate} />

        <div className="flex justify-end">
          <CSVDownloadButton
            data={csvData}
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

                <TableHead className="text-center font-semibold border-r border-gray-300 border-l-2 bg-green-50 min-w-[100px]">
                  {t('dashboard.sales.sales')}
                </TableHead>
                <TableHead className="text-center font-semibold border-r border-gray-300 bg-yellow-50 min-w-[100px]">
                  {t('dashboard.sideBar.pendingDelivery')}
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
              {Object.entries(factoryGroups).map(([factoryCode, rows]) => (
                <React.Fragment key={factoryCode}>
                  {rows.map((row, idx) => (
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
                        {row.total_sales.toLocaleString()}
                      </TableCell>
                      <TableCell className="border-r border-gray-300 text-right tabular-nums bg-yellow-50">
                        {Math.round(row.avg_sales).toLocaleString()}
                      </TableCell>

                      <TableCell className="border-r border-gray-300 border-l-2 text-right font-semibold tabular-nums bg-green-50">
                        {row.selected_month_sales.toLocaleString()}
                      </TableCell>
                      <TableCell className="border-r border-gray-300 text-right tabular-nums bg-yellow-50">
                        {row.planned_deliveries.toLocaleString()}
                      </TableCell>

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

                  {/* Factory summary row */}
                  {(() => {
                    const sumTotal = rows.reduce((s, r) => s + r.total_sales, 0)
                    const sumAvg = rows.reduce((s, r) => s + r.avg_sales, 0)
                    const sumSelected = rows.reduce((s, r) => s + r.selected_month_sales, 0)
                    const sumPlanned = rows.reduce((s, r) => s + r.planned_deliveries, 0)

                    return (
                      <TableRow className="font-bold bg-gray-100 border-t-2 border-b-2 border-gray-400">
                        <TableCell className="border-r border-gray-300 text-center">
                          {factoryCode}
                        </TableCell>
                        <TableCell className="border-r-2 border-gray-300">
                          {rows[0]!.factory_name}
                        </TableCell>
                        <TableCell colSpan={2} className="border-r border-gray-300 text-center sticky left-0 bg-gray-100 z-10">
                          {t('common.total')}
                        </TableCell>

                        <TableCell className="border-r border-gray-300 border-l-2 text-right tabular-nums bg-green-100">
                          {sumTotal.toLocaleString()}
                        </TableCell>
                        <TableCell className="border-r border-gray-300 text-right tabular-nums bg-yellow-100">
                          {Math.round(sumAvg).toLocaleString()}
                        </TableCell>

                        <TableCell className="border-r border-gray-300 border-l-2 text-right tabular-nums bg-green-100">
                          {sumSelected.toLocaleString()}
                          <span className="text-gray-500 text-xs">{pct(sumSelected, sumAvg)}</span>
                        </TableCell>
                        <TableCell className="border-r border-gray-300 text-right tabular-nums bg-yellow-100">
                          {sumPlanned.toLocaleString()}
                          <span className="text-gray-500 text-xs">{pct(sumSelected + sumPlanned, sumAvg)}</span>
                        </TableCell>

                        {ymCols.map(col => (
                          <TableCell key={col} className="border-r border-gray-200 text-right tabular-nums bg-blue-50">
                            {rows.reduce((s, r) => s + (Number(r[col]) || 0), 0).toLocaleString()}
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  })()}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </SidebarInset>
      
      <SidebarRight filterConfig={FilterConfig} />
    </SidebarProvider>
  )
}