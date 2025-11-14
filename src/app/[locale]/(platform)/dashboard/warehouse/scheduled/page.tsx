import { getScheduledAndActualSales } from '@/lib/api/server';
import { getTranslations } from "next-intl/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import type { PageFilterConfig } from "@/types"
import { getCurrentYear, generateYearOptions } from '@/lib/utils/date'
import { getFactoryOptions } from '@/lib/utils/filter'
import ScheduledChart from './cheduled_chart';

interface PageProps {
  searchParams: Promise<{
    year: string
    factory: string
  }>
}

export default async function Page({ searchParams }: PageProps) {

  const t = await getTranslations()

  const params = await searchParams
  const factoryOptions = await getFactoryOptions()
  const factoryName = factoryOptions.find(option => option.value === params.factory)?.label || params.factory

  const FilterConfig: PageFilterConfig = {
    showResetButton: false,
    autoApplyFilters: true,
      defaultValues: {
      year: getCurrentYear(),
      factory: '30673'
    },
    isPaginated: false,
    filters: [
      {
        id: 'factory',
        type: 'combobox',
        label: t('filter.selectFactory'),
        options: factoryOptions
      },
      {
        id: 'year',
        type: 'select',
        label: t('filter.selectYear'),
        options: generateYearOptions()
      },
    ]
  }

  const scheduledAndActualSales = await getScheduledAndActualSales(params)

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">

        <SidebarRightMobileTrigger />
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