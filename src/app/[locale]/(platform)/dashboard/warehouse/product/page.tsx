import { getProductSalesRangeDiff, getProductOrderRangeDiff, getMaxSalesDate } from '@/lib/api/server';
import { getTranslations, getLocale } from "next-intl/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import type { PageFilterConfig } from "@/types"
import { format, startOfMonth, subMonths } from 'date-fns'
import SalesVsTargetChart from './SalesVsTarget'
import SalesDiffChart from './SalesDiff'
import OrderVsTargetChart from './OrderVsTarget';
import OrderDiffChart from './OrderDiff';
import { ProductSalesRangeDiffTable, ProductOrderRangeDiffTable} from './DataTable';
import { getFactoryOptions, redirectWithDefaults } from '@/lib/utils/filter';

interface PageProps {
  searchParams: Promise<{
    date__gte: string
    date__lte: string
    date_target__gte: string
    date_target__lte: string
    factory: string
    table: string
  }>
}

export default async function Page({ searchParams }: PageProps) {

  const params = await searchParams
  const locale = await getLocale()
  const t = await getTranslations()

  const maxSalesDate = await getMaxSalesDate()
  const today = new Date(maxSalesDate)
  
  const firstDateOfMonth = startOfMonth(today);
  // Today - 1 month (same day, previous month)
  const oneMonthAgo = subMonths(today, 1);
  // First date of (today - 1 month)
  const firstDateOfLastMonth = startOfMonth(oneMonthAgo);

  const defaultParams = {
    date__gte: format(firstDateOfMonth,'yyyy-MM-dd'),
    date__lte: format(today,'yyyy-MM-dd'),
    date_target__gte: format(firstDateOfLastMonth,'yyyy-MM-dd'),
    date_target__lte: format(oneMonthAgo,'yyyy-MM-dd'),
  }

  redirectWithDefaults({
    currentParams: params,
    defaultParams,
    pathname: '/dashboard/warehouse/product',
    locale
  });

  const factoryOptions = await getFactoryOptions()
  const factoryName = factoryOptions.find(option => option.value === params.factory)?.label || t('crm.factories.allFactory')

  const FilterConfig: PageFilterConfig = {
    showResetButton: false,
    autoApplyFilters: true,
    isPaginated: false,

    filters: [
      {
        id: 'date_target',
        type: 'date-range',
        label: t('filter.targetDate'),
        placeholder: t('filter.targetDate'),
      },
      {
        id: 'date',
        type: 'date-range',
        label: t('filter.selectDate'),
        placeholder: t('filter.selectDate'),
      },
      {
        id: 'factory',
        type: 'combobox',
        label: t('filter.selectFactory'),
        placeholder: t('filter.selectFactory'),
        options: await getFactoryOptions()
      },
      {
        id: 'table',
        type: 'multiselect',
        label: t('filter.table'),
        placeholder: t('filter.selectTable'),
        options: [
          { value: 'sales', label: t('dashboard.sales.sales') },
          { value: 'order', label: t('dashboard.order.order') },
        ]
      }
    ]
  }

  

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

  const selectedTables = params.table 
    ? params.table.split(',').map(t => t.trim()) 
    : []

  const showSalesTable = selectedTables.includes('sales')
  const showOrderTable = selectedTables.includes('order')

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />
        {/* Sales by Product */}
          <div>
            <h1 className="text-center text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold break-words">
              {factoryName} <br />
              Giao hàng theo SP - 按產品分列的銷售額 <br />
              {params.date_target__gte}→{params.date_target__lte} ~ {params.date__gte}→{params.date__lte}
            </h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <SalesVsTargetChart data={first5AndLast5Sales} />
            <SalesDiffChart data={first5AndLast5Sales} />
          </div>
          {showSalesTable && (
            <ProductSalesRangeDiffTable 
              data={productSalesRangeDiff} 
              dateRange={{ start: params.date__gte, end: params.date__lte }}
            />
          )}

          {/* Order by Product */}
          <div>
            <h1 className="text-center text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold break-words">
              {factoryName} <br />
              Đơn đặt hàng theo SP - 按產品排序 <br />
              {params.date_target__gte}→{params.date_target__lte} ~ {params.date__gte}→{params.date__lte}
            </h1>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <OrderVsTargetChart data={first5AndLast5Order}/>
            <OrderDiffChart data={first5AndLast5Order}/>
          </div>

          {showOrderTable && (
            <ProductOrderRangeDiffTable 
              data={productOrderRangeDiff}
              dateRange={{ start: params.date__gte, end: params.date__lte }}
            />
          )}

      </SidebarInset>
      <SidebarRight filterConfig={FilterConfig} />
    </SidebarProvider>
  )
}