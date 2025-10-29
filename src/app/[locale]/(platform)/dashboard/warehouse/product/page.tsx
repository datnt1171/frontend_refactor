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
import { ProductSalesRangeDiffTable, ProductOrderRangeDiffTable} from './DataTable';
import { getFactoryOptions } from '@/lib/utils/filter';

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
      },
      {
        id: 'table',
        type: 'multiselect',
        label: "Table",
        options: [
          { value: 'sales', label: 'Sales' },
          { value: 'order', label: 'Order' },
        ]
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

  const selectedTables = params.table 
    ? params.table.split(',').map(t => t.trim()) 
    : []

  const showSalesTable = selectedTables.includes('sales')
  const showOrderTable = selectedTables.includes('order')

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

              {/* Sales by Product */}
              <div>
                <h1 className="text-center text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold break-words">
                  Sales by Product - Sales by Product <br />
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
                  Order by Product - Order by Product <br />
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

            </div>
          </div>
          <SidebarRight filterConfig={FilterConfig} />
        </div>
      </SidebarProvider>
    </RightSidebarProvider>
  )
}