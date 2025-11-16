import { getSalesOvertime } from '@/lib/api/server';
import { getTranslations } from "next-intl/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import type { PageFilterConfig } from "@/types"
import { getCurrentYear, getLastYear } from '@/lib/utils/date'
import { getFactoryOptions, getYearOptions, getTimeSelectOptions } from '@/lib/utils/filter'
import SalesOvertimeChart from './SalesOvertimeChart';

interface PageProps {
  searchParams: Promise<{
    year: string
    group_by: string
    factory: string
    product: string
  }>
}

export default async function Page({ searchParams }: PageProps) {

  const t = await getTranslations()
  const TIME_SELECT_OPTIONS = await getTimeSelectOptions()

  const FilterConfig: PageFilterConfig = {
    showResetButton: false,
    autoApplyFilters: true,
    isPaginated: false,

    defaultValues: {
      year: [getCurrentYear(), getLastYear()],
      group_by: 'month,year'
    },
    
    filters: [
      {
        id: 'year',
        type: 'multiselect',
        label: t('filter.selectYear'),
        placeholder: t('filter.selectYear'),
        options: getYearOptions()
      },
      {
        id: 'group_by',
        type: 'select',
        label: t('filter.groupBy'),
        placeholder: t('filter.groupBy'),
        options: TIME_SELECT_OPTIONS
      },
      {
        id: 'factory',
        type: 'combobox',
        label: t('filter.selectFactory'),
        placeholder: t('filter.selectFactory'),
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

  const params = await searchParams
  const xAxisName = TIME_SELECT_OPTIONS.find(option => option.value === params.group_by)?.label || params.group_by
  const salesOvertime = await getSalesOvertime(params)

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />

        <div>
          <h1 className="text-center text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold break-words">
            銷售額隨時間變化 - Giao hàng theo thời gian
          </h1>
        </div>
        <div className="w-full flex justify-center">
          <SalesOvertimeChart 
            data={salesOvertime} 
            group_by={params.group_by || 'month,year'}
            xAxisName={xAxisName}
          />
        </div>
      </SidebarInset>

      <SidebarRight filterConfig={FilterConfig} />
    </SidebarProvider>
  )
}