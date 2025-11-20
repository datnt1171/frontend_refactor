import { getSalesBOM, getOrderBOM, getMaxSalesDate } from '@/lib/api/server';
import { getFactoryOptions } from '@/lib/utils/filter';
import { getTranslations } from "next-intl/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import type { PageFilterConfig } from "@/types"
import { format, startOfMonth } from 'date-fns'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Link } from '@/i18n/navigation'

interface PageProps {
  searchParams: Promise<{
    date__gte: string
    date__lte: string
    factory: string
  }>
}

export default async function Page({ searchParams }: PageProps) {

  const t = await getTranslations()

  const maxSalesDate = await getMaxSalesDate()
  const today = new Date(maxSalesDate)

  const firstDateOfMonth = startOfMonth(today);

  const FilterConfig: PageFilterConfig = {
    showResetButton: false,
    autoApplyFilters: true,
    isPaginated: false,

    defaultValues: {
      date: {
        gte: format(firstDateOfMonth,'yyyy-MM-dd'),
        lte: format(today,'yyyy-MM-dd')
      }
    },
    
    filters: [
      {
        id: 'date',
        type: 'date-range',
        label: t('filter.selectDate'),
        placeholder: t('filter.selectDate'),
      },
      {
        id: 'factory',
        type: 'multiselect',
        label: t('filter.selectFactory'),
        placeholder: t('filter.selectFactory'),
        options: await getFactoryOptions()
      }
    ]
  }

  const params = await searchParams

  

  const salesBOM = await getSalesBOM(params)
  const orderBOM = await getOrderBOM(params)


  // Parse dates from params
  const dateGte = new Date(params.date__gte)
  

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />

        
      </SidebarInset>
      
      <SidebarRight filterConfig={FilterConfig} />
    </SidebarProvider>
  )
}