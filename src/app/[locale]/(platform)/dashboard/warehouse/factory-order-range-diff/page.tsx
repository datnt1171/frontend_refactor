import { getFactoryOrderRangeDiff } from '@/lib/api/server';
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

  const today = toZonedTime(new Date(), 'Asia/Ho_Chi_Minh');
  const firstDateOfMonth = startOfMonth(today);
  // Today - 1 month (same day, previous month)
  const oneMonthAgo = subMonths(today, 1);
  // First date of (today - 1 month)
  const firstDateOfLastMonth = startOfMonth(oneMonthAgo);

  const FilterConfig: PageFilterConfig = {
    showResetButton: false,
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
        label: 'Increase',
        options: [
          { value: 'true', label: 'Increase' },
          { value: 'false', label: 'Descrease' },
        ]
      },
      {
        id: 'date_target',
        type: 'date-range',
        label: 'Target',
      },
      {
        id: 'date',
        type: 'date-range',
        label: 'Current',
      },
    ]
  }

  const t = await getTranslations()
  const params = await searchParams

  const factoryOrderRangeDiff = await getFactoryOrderRangeDiff(params)

  const currentStart = new Date(params.date__gte)
  const currentEnd = new Date(params.date__lte)
  const targetStart = new Date(params.date_target__gte)
  const targetEnd = new Date(params.date_target__lte)
  
  // Extract month and year
  const currentMonth = currentStart.getMonth() + 1 // 0-indexed, so add 1
  const currentYear = currentStart.getFullYear()
  const targetMonth = targetStart.getMonth() + 1
  const targetYear = targetStart.getFullYear()

  // Get day range
  const startDay = currentStart.getDate()
  const endDay = currentEnd.getDate()

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
              <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>數字順序 - STT</TableHead>
                      <TableHead>客戶代號 MÃ KHÁCH HÀNG</TableHead>
                      <TableHead>客戶名称 TÊN KHÁCH HÀNG</TableHead>
                      <TableHead>訂單總數 2025年9月 - ĐĐH cả tháng {targetMonth}</TableHead>
                      <TableHead>{params.date_target__gte}~{params.date_target__lte} 的訂單 SỐ LƯỢNG ĐĐH</TableHead>
                      <TableHead>{params.date__gte}~{params.date__lte} 的訂單 SỐ LƯỢNG ĐĐH</TableHead>
                      <TableHead>数量差异 SỐ LƯỢNG CHÊNH LỆCH</TableHead>
                      <TableHead>% 差異 TỈ LỆ CHÊNH LỆCH</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {factoryOrderRangeDiff.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          {t('common.noDataFound')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      factoryOrderRangeDiff.map((data, index) => (
                        <TableRow key={data.factory_code}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell>{data.factory_code}</TableCell>
                        <TableCell>{data.factory_name}</TableCell>
                        <TableCell className="text-right">
                          {data.whole_month_order_quantity.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {data.order_quantity_target.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {data.order_quantity.toLocaleString()}
                        </TableCell>
                        <TableCell className={`text-right ${data.quantity_diff < 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {data.quantity_diff.toLocaleString()}
                        </TableCell>
                        <TableCell className={`text-right ${data.quantity_diff_pct < 0 ? 'text-red-500' : 'text-green-500'}`}>
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