import { getWarehouseOverall } from '@/lib/api/server';
import OverallChart from './OverallChart';
import { getTranslations } from "next-intl/server"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import type { PageFilterConfig } from "@/types"
import { format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'
import { generateYearOptions } from '@/lib/utils/date';
import { getFactoryOptions, getMonthOptions } from '@/lib/utils/filter';

interface PageProps {
  searchParams: Promise<{
    day__gte: string
    day__lte: string
    month__gte: string
    month__lte: string
    year: string
    target_month: string
    target_year: string
    exclude_factory: string
  }>
}

export default async function Page({ searchParams }: PageProps) {

  const t = await getTranslations()
  const MONTH_OPTIONS = await getMonthOptions()

  const today = toZonedTime(new Date(), 'Asia/Ho_Chi_Minh');
  const FilterConfig: PageFilterConfig = {
    showResetButton: false,
      defaultValues: {
      day: {
        gte: '1',
        lte: format(today, 'd')
      },
      month: {
        gte: '1',
        lte: format(today, 'M')
      },
      year: format(today, 'yyyy'),
      target_month: '5',
      target_year: '2022',
      exclude_factory: '30673'
    },
    isPaginated: false,
    filters: [
      {
        id: 'day',
        type: 'day-range',
        label: t('filter.selectDay'),
      },
      {
        id: 'month',
        type: 'month-range',
        label: t('filter.selectMonth'),
      },
      {
        id: 'year',
        type: 'select',
        label: t('filter.selectYear'),
        options: generateYearOptions()
      },
      {
        id: 'target_year',
        type: 'select',
        label: t('filter.targetYear'),
        options: generateYearOptions()
      },
      {
        id: 'target_month',
        type: 'select',
        label: t('filter.targetMonth'),
        options: MONTH_OPTIONS
      },
      {
        id: 'exclude_factory',
        type: 'select',
        label: t('filter.excludedFactory'),
        options: await getFactoryOptions()
      }
    ]
  }

  const params = await searchParams
  
  const data = await getWarehouseOverall(params)

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
                  {params.year}年每月送貨比较与{params.target_year}年{params.target_month}月相比 
                  (每月{params.day__gte}日~{params.day__lte}日)<br />
                  SO SÁNH SỐ LƯỢNG GIAO HÀNG MỖI THÁNG SO VỚI THÁNG {params.target_month} NĂM {params.target_year}
                </h1>
                <OverallChart data={data} />
              </div>

              </div>
            </div>
          <SidebarRight filterConfig={FilterConfig} />
        </div>
      </SidebarProvider>
    </RightSidebarProvider>
  )
}