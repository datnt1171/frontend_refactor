import { getFactoryOrderRangeDiff, getMaxSalesDate } from '@/lib/api/server';
import { getTranslations } from "next-intl/server"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import type { PageFilterConfig } from "@/types"
import { format, startOfMonth, subMonths } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
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
import { Link } from '@/i18n/navigation'

interface PageProps {
  searchParams: Promise<{
    date__gte: string
    date__lte: string
    date_target__gte: string
    date_target__lte: string
    increase: string
  }>
}

export default async function Page({ searchParams }: PageProps) {

  const maxSalesDate = await getMaxSalesDate()
  const today = new Date(maxSalesDate)

  const firstDateOfMonth = startOfMonth(today);
  // Today - 1 month (same day, previous month)
  const oneMonthAgo = subMonths(today, 1);
  // First date of (today - 1 month)
  const firstDateOfLastMonth = startOfMonth(oneMonthAgo);

  const t = await getTranslations()

  const FilterConfig: PageFilterConfig = {
    showResetButton: false,
    autoApplyFilters: true,
      defaultValues: {
      date: {
        gte: format(firstDateOfMonth,'yyyy-MM-dd'),
        lte: format(today,'yyyy-MM-dd')
      },
      date_target: {
        gte: format(firstDateOfLastMonth,'yyyy-MM-dd'),
        lte: format(oneMonthAgo,'yyyy-MM-dd')
      },
      increase: 'false'
    },
    isPaginated: false,
    filters: [
      {
        id: 'increase',
        type: 'select',
        label: t('filter.increase'),
        options: [
          { value: 'true', label: t('filter.increase') },
          { value: 'false', label: t('filter.descrease') },
        ]
      },
      {
        id: 'date_target',
        type: 'date-range',
        label: t('filter.targetDate'),
      },
      {
        id: 'date',
        type: 'date-range',
        label: t('filter.selectDate'),
      },
    ]
  }

  const params = await searchParams

  const factoryOrderRangeDiff = await getFactoryOrderRangeDiff(params)

  // Parse dates from params
  const dateGte = new Date(params.date__gte)
  const dateTargetGte = new Date(params.date_target__gte)
  
  // Extract month and year
  const dateGteMonth = dateGte.getMonth() + 1 // getMonth() returns 0-11
  const dateGteYear = dateGte.getFullYear()
  const dateTargetGteMonth = dateTargetGte.getMonth() + 1
  const dateTargetGteYear = dateTargetGte.getFullYear()

  // Get translations for both languages
  const tZh = await getTranslations({locale: 'zh-hant'})
  const tVi = await getTranslations({locale: 'vi'})
  
  const isIncrease = params.increase === 'true'
  const increaseKey = isIncrease ? 'increase' : 'decrease'

  const factoryOrderRangeDiffColumns: ColumnConfig[] = [
    { 
      key: 'factory_code', 
      header: '客戶代號 / MÃ KHÁCH HÀNG' 
    },
    { 
      key: 'factory_name', 
      header: '客戶名称 / TÊN KHÁCH HÀNG' 
    },
    { 
      key: 'whole_month_order_quantity', 
      header: `${dateTargetGteMonth}月訂單總數 / ĐĐH cả tháng ${dateTargetGteMonth}` 
    },
    { 
      key: 'order_quantity_target', 
      header: `${params.date_target__gte}→${params.date_target__lte} 的訂單 / SỐ LƯỢNG ĐĐH` 
    },
    { 
      key: 'order_quantity', 
      header: `${params.date__gte}→${params.date__lte} 的訂單 / SỐ LƯỢNG ĐĐH` 
    },
    { 
      key: 'quantity_diff', 
      header: '数量差异 / SỐ LƯỢNG CHÊNH LỆCH' 
    },
    { 
      key: 'quantity_diff_pct', 
      header: '% 差異 / % CHÊNH LỆCH',

    }
  ]

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

              <div>
                <h1 className="text-center text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold break-words">
                  {tZh('dashboard.warehouse.factoryOrderRangeDiff.title', {
                    currentMonth: dateGteMonth,
                    currentYear: dateGteYear,
                    targetMonth: dateTargetGteMonth,
                    targetYear: dateTargetGteYear,
                    change: tZh(`dashboard.warehouse.factoryOrderRangeDiff.${increaseKey}`)
                  })} <br />
                  {tVi('dashboard.warehouse.factoryOrderRangeDiff.title', {
                    currentMonth: dateGteMonth,
                    currentYear: dateGteYear,
                    targetMonth: dateTargetGteMonth,
                    targetYear: dateTargetGteYear,
                    change: tVi(`dashboard.warehouse.factoryOrderRangeDiff.${increaseKey}`)
                  })}
                </h1>
              </div>
              <CSVDownloadButton
                data={factoryOrderRangeDiff}
                columns={factoryOrderRangeDiffColumns}
                filename={`factory-order-${params.date__gte}-${params.date__lte}`}
                buttonText="Download CSV"
              />
              <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#DFF2EB]">
                      <TableHead className="border-r font-bold text-center">
                        <div>數字順序</div>
                        <div>STT</div>
                      </TableHead>
                      <TableHead className="border-r font-bold text-center">
                        <div>客戶代號</div>
                        <div>MÃ KHÁCH HÀNG</div>
                      </TableHead>
                      <TableHead className="border-r font-bold text-center">
                        <div>客戶名称</div>
                        <div>TÊN KHÁCH HÀNG</div>
                      </TableHead>
                      <TableHead className="border-r font-bold text-center">
                        <div>{dateTargetGteMonth}月訂單總數</div>
                        <div>ĐĐH cả tháng {dateTargetGteMonth}</div>
                      </TableHead>
                      <TableHead className="border-r font-bold text-center">
                        <div>{params.date_target__gte}→{params.date_target__lte}</div>
                        <div>的訂單 SỐ LƯỢNG ĐĐH</div>
                      </TableHead>
                      <TableHead className="border-r font-bold text-center">
                        <div>{params.date__gte}→{params.date__lte}</div>
                        <div>的訂單 SỐ LƯỢNG ĐĐH</div>
                      </TableHead>
                      <TableHead className="border-r font-bold text-center">
                        <div>数量差异</div>
                        <div>SỐ LƯỢNG CHÊNH LỆCH</div>
                      </TableHead>
                      <TableHead className="font-bold text-center">
                        <div>% 差異</div>
                        <div>% CHÊNH LỆCH</div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {factoryOrderRangeDiff.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          {t('common.noDataFound')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      factoryOrderRangeDiff.map((data, index) => (
                        <TableRow key={data.factory_code}>
                        <TableCell className="text-center border-r">{index + 1}</TableCell>
                        <TableCell className="font-bold border-r">
                          <Link href={`/dashboard/warehouse/product?factory=${data.factory_code}&date_target__gte=${params.date__gte}&date_target__lte=${params.date__lte}&date__gte=${params.date_target__gte}&date__lte=${params.date_target__lte}`} 
                                className="hover:underline">
                            {data.factory_code}
                          </Link>
                        </TableCell>
                        <TableCell className="border-r">{data.factory_name}</TableCell>
                        <TableCell className={`text-right border-r ${data.whole_month_order_quantity === 0 ? 'bg-red-300' : ''}`}>
                          {Math.round(data.whole_month_order_quantity).toLocaleString()}
                        </TableCell>
                        <TableCell className={`text-right border-r ${data.order_quantity_target === 0 ? 'bg-red-300' : ''}`}>
                          {Math.round(data.order_quantity_target).toLocaleString()}
                        </TableCell>
                        <TableCell className={`text-right border-r ${data.order_quantity === 0 ? 'bg-red-300' : ''}`}>
                          {Math.round(data.order_quantity).toLocaleString()}
                        </TableCell>
                        <TableCell className={`text-right border-r ${data.quantity_diff < 0 ? 'bg-red-300' : 'bg-green-200'}`}>
                          {Math.round(data.quantity_diff).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {(data.quantity_diff_pct * 100).toFixed(2)}%
                        </TableCell>
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