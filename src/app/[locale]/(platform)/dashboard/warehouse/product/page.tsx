import { getProductSalesRangeDiff, getProductOrderRangeDiff } from '@/lib/api/server';
import { getTranslations } from "next-intl/server"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import type { PageFilterConfig } from "@/types"
import { format, startOfMonth, subMonths } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import SalesVsTargetChart from './SalesVsTarget'
import SalesDiffChart from './SalesDiff'
import OrderVsTargetChart from './OrderVsTarget';
import OrderDiffChart from './OrderDiff';
import { getFactoryOptions } from '@/lib/utils/filter';

interface PageProps {
  searchParams: Promise<{
    date__gte: string
    date__lte: string
    date_target__gte: string
    date_target__lte: string
    factory: string
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
      {
        id: 'factory',
        type: 'combobox',
        label: 'Factory',
        options: await getFactoryOptions()
      }
    ]
  }

  const t = await getTranslations()
  const params = await searchParams

  const productSalesRangeDiff = await getProductSalesRangeDiff(params)
  const productOrderRangeDiff = await getProductOrderRangeDiff(params)

  const first5AndLast5Sales = [
    ...productSalesRangeDiff.slice(0, 5),
    ...productSalesRangeDiff.slice(-5)
  ];

  const first5AndLast5Order = [
    ...productOrderRangeDiff.slice(0, 5),
    ...productOrderRangeDiff.slice(-5)
  ];

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
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <SalesVsTargetChart data={first5AndLast5Sales} />
                <SalesDiffChart data={first5AndLast5Sales} />
                <OrderVsTargetChart data={first5AndLast5Order}/>
                <OrderDiffChart data={first5AndLast5Order}/>
              </div>
            </div>
          </div>
          <SidebarRight filterConfig={FilterConfig} />
        </div>
      </SidebarProvider>
    </RightSidebarProvider>
  )
}