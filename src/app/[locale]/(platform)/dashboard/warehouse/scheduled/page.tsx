import { getScheduledAndActualSales, getMaxSalesDate } from '@/lib/api/server';
import { getTranslations, getLocale } from "next-intl/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import type { PageFilterConfig } from "@/types"
import { getCurrentYear, generateYearOptions } from '@/lib/utils/date'
import { getFactoryOptions, redirectWithDefaults } from '@/lib/utils/filter'
import ScheduledChart from './cheduled_chart';
import { DataStatusBadge } from '@/components/ui/DataStatusBadge';

interface PageProps {
  searchParams: Promise<{
    year: string
    factory: string
  }>
}

export default async function Page({ searchParams }: PageProps) {

  const params = await searchParams
  const locale = await getLocale()
  const t = await getTranslations()

  const factoryOptions = await getFactoryOptions()
  const factoryName = factoryOptions.find(option => option.value === params.factory)?.label || params.factory

  const defaultParams = {
    year: getCurrentYear(),
    factory: '30673',
  }

  redirectWithDefaults({
    currentParams: params,
    defaultParams,
    pathname: '/dashboard/warehouse/scheduled',
    locale
  });

  const FilterConfig: PageFilterConfig = {
    showResetButton: false,
    autoApplyFilters: true,
    isPaginated: false,

    filters: [
      {
        id: 'factory',
        type: 'combobox',
        label: t('filter.selectFactory'),
        placeholder: t('filter.selectFactory'),
        options: factoryOptions
      },
      {
        id: 'year',
        type: 'select',
        label: t('filter.selectYear'),
        placeholder: t('filter.selectFactory'),
        options: generateYearOptions()
      },
    ]
  }

  const maxSalesDate = await getMaxSalesDate()
  const scheduledAndActualSales = await getScheduledAndActualSales(params)

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">

        <SidebarRightMobileTrigger />

        <DataStatusBadge date={maxSalesDate} />
        <div>
          <h1 className="pb-4 text-center text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold break-words">
            計劃及實際銷售 - {factoryName} <br />
            Dự định GH và GH thực tế - {factoryName}
          </h1>
          <ScheduledChart data={scheduledAndActualSales} />
        </div>
      </SidebarInset>

      <SidebarRight filterConfig={FilterConfig} />
    </SidebarProvider>
  )
}