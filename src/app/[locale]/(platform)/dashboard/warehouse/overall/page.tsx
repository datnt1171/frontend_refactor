import { getWarehouseOverall, getMaxSalesDate } from '@/lib/api/server';
import OverallChart from './OverallChart';
import { getTranslations } from "next-intl/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import type { PageFilterConfig } from "@/types"
import { format } from 'date-fns'
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

  const maxSalesDate = await getMaxSalesDate()
  const today = new Date(maxSalesDate)
  
  const FilterConfig: PageFilterConfig = {
    showResetButton: false,
    autoApplyFilters: true,
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
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />

        <div>
          <h1 className="text-center text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold break-words pb-2">
            {params.year}年每月送貨比较与{params.target_year}年{params.target_month}月相比 
            (每月{params.day__gte}日~{params.day__lte}日)<br />
            SO SÁNH SỐ LƯỢNG GIAO HÀNG MỖI THÁNG SO VỚI THÁNG {params.target_month} NĂM {params.target_year}
          </h1>
          <OverallChart data={data} />
        </div>
      </SidebarInset>
      
      <SidebarRight filterConfig={FilterConfig} />
    </SidebarProvider>
  )
}