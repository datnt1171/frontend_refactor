import { getScheduledAndActualSales } from '@/lib/api/server';
import { getTranslations } from "next-intl/server"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
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
  const params = await searchParams
  const factoryOptions = await getFactoryOptions()
  const factoryName = factoryOptions.find(option => option.value === params.factory)?.label || params.factory

  const FilterConfig: PageFilterConfig = {
    showResetButton: false,
      defaultValues: {
      year: getCurrentYear(),
      factory: '30673'
    },
    isPaginated: false,
    filters: [
      {
        id: 'factory',
        type: 'combobox',
        label: 'Factory',
        options: factoryOptions
      },
      {
        id: 'year',
        type: 'select',
        label: 'Year',
        options: generateYearOptions()
      },
    ]
  }

  const t = await getTranslations()
  const scheduledAndActualSales = await getScheduledAndActualSales(params)

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
                  計劃及實際銷售 - {factoryName} <br />
                  Dự định GH và GH thực tế - {factoryName}
                </h1>
                <ScheduledChart data={scheduledAndActualSales} />
              </div>
            </div>
          </div>
          <SidebarRight filterConfig={FilterConfig} />
        </div>
      </SidebarProvider>
    </RightSidebarProvider>
  )
}