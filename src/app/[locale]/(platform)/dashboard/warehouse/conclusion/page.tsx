import { getSalesOrderPctDiff, getIsSameMonth } from '@/lib/api/server';
import { getTranslations } from "next-intl/server"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import type { PageFilterConfig } from "@/types"
import { format, startOfMonth, subMonths } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import SalesOrderChart from './stackedchart'

interface PageProps {
  searchParams: Promise<{
    date__gte: string
    date__lte: string
    date_target__gte: string
    date_target__lte: string
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
      }
    },
    isPaginated: false,
    filters: [
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

  const salesOrderPctDiff = await getSalesOrderPctDiff(params)
  const isSameMonth = await getIsSameMonth(params)

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
              <div className="space-y-1">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold break-words">
                  {currentMonth}月分的订单量与{targetYear}年{targetMonth}月相比 
                  ĐĐH THÁNG {currentMonth} SO VỚI THÁNG {targetMonth}/{targetYear} 
                  ({startDay}日~{endDay}日):
                </h1>
                
                <div className="space-y-2 text-sm sm:text-base">
                  <div className="flex flex-wrap items-center gap-x-2">
                    <span>• 沒有包含大森 KHÔNG BAO GỒM TIMBER:</span>
                    <span className={salesOrderPctDiff.remain_order_pct_diff >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {salesOrderPctDiff.remain_order_pct_diff >= 0 ? '增加TĂNG' : '減少GIẢM'} {(salesOrderPctDiff.remain_order_pct_diff * 100).toFixed(2)}%
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-2">
                    <span>• 有包含大森 BAO GỒM CẢ TIMBER:</span>
                    <span className={salesOrderPctDiff.order_pct_diff >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {salesOrderPctDiff.order_pct_diff >= 0 ? '增加TĂNG' : '減少GIẢM'} {(salesOrderPctDiff.order_pct_diff * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold break-words">
                  {currentMonth}月分的送货量与{targetYear}年{targetMonth}月相比 
                  GH THÁNG {currentMonth} SO VỚI THÁNG {targetMonth}/{targetYear} 
                  ({startDay}日~{endDay}日)
                </h1>
                
                <div className="space-y-2 text-sm sm:text-base">
                  <div className="flex flex-wrap items-center gap-x-2">
                    <span>• 沒有包含大森 KHÔNG BAO GỒM TIMBER:</span>
                    <span className={salesOrderPctDiff.remain_sales_pct_diff >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {salesOrderPctDiff.remain_sales_pct_diff >= 0 ? '增加TĂNG' : '減少GIẢM'} {(salesOrderPctDiff.remain_sales_pct_diff * 100).toFixed(2)}%
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-2">
                    <span>• 有包含大森 BAO GỒM CẢ TIMBER:</span>
                    <span className={salesOrderPctDiff.sales_pct_diff >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {salesOrderPctDiff.sales_pct_diff >= 0 ? '增加TĂNG' : '減少GIẢM'} {(salesOrderPctDiff.sales_pct_diff * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-center">
                <SalesOrderChart data={isSameMonth} />
              </div>
            </div>
          </div>
          <SidebarRight filterConfig={FilterConfig} />
        </div>
      </SidebarProvider>
    </RightSidebarProvider>
  )
}