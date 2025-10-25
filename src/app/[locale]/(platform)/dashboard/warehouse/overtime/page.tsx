import { getSalesOvertime } from '@/lib/api/server';
import { getTranslations } from "next-intl/server"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import type { PageFilterConfig } from "@/types"
import { getCurrentYear, getLastYear } from '@/lib/utils/date'
import { getFactoryOptions, TIME_SELECT_OPTIONS, getYearOptions } from '@/lib/utils/filter'
import SalesOvertimeChart from './SalesOvertimeChart';

interface PageProps {
  searchParams: Promise<{
    date__gte: string
    date__lte: string
    date_target__gte: string
    group_by: string
    factory: string
  }>
}

export default async function Page({ searchParams }: PageProps) {

  const FilterConfig: PageFilterConfig = {
    showResetButton: false,
    defaultValues: {
      year: [getCurrentYear(), getLastYear()],
      group_by: 'month,year'
    },
    isPaginated: false,
    filters: [
      {
        id: 'year',
        type: 'multiselect',
        label: 'Year',
        options: getYearOptions()
      },
      {
        id: 'group_by',
        type: 'select',
        label: 'Group by',
        options: TIME_SELECT_OPTIONS
      },
      {
        id: 'factory',
        type: 'combobox',
        label: 'Factory',
        options: await getFactoryOptions()
      },
      // { TODO
      //   id: 'product',
      //   type: 'combobox',
      //   label: 'Product',
      //   options: await getProductOptions()
      // },
    ]
  }

  const t = await getTranslations()
  const params = await searchParams
  const salesOvertime = await getSalesOvertime(params)

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
              <div className="w-full flex justify-center">
                <SalesOvertimeChart 
                  data={salesOvertime} 
                  groupBy={params.group_by?.split(',') || ['year', 'month']} 
                />
              </div>
            </div>
          </div>
          <SidebarRight filterConfig={FilterConfig} />
        </div>
      </SidebarProvider>
    </RightSidebarProvider>
  )
}