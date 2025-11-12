import { getTranslations } from "next-intl/server"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import type { PageFilterConfig } from "@/types"
import { SalesFileUpload, OrderFileUpload } from './SalesOrderUpload';
import { getFactOrder, getFactSales } from "@/lib/api/server"
import type { FactOrder, FactSales } from "@/types"
import { FactOrderCSVButtons } from "./OrderCSVButton"
import { FactSalesCSVButtons } from "./SalesCSVButton"

interface PageProps {
  searchParams: Promise<{
    date__gte: string
    date__lte: string
  }>
}

export default async function Page({ searchParams }: PageProps) {

  const t = await getTranslations()

  const FilterConfig: PageFilterConfig = {
    showResetButton: false,
    isPaginated: false,
    filters: [
      {
        id: 'date',
        type: 'date-range',
        label: t('filter.selectDate'),
      },
    ]
  }

  const params = await searchParams
  let factOrder: FactOrder[] = []
  let factSales: FactSales[] = []

  if (params.date__gte && params.date__lte) {
    factOrder = await getFactOrder(params)
    factSales = await getFactSales(params)
  }


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

              {/* File upload */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-4">
                <SalesFileUpload />
                <OrderFileUpload />
              </div>

              {/* Data download */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                  <h3 className="text-center text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold break-words">
                    {t('dashboard.order.downloadOrderData')}
                  </h3>
                  {factOrder.length > 0 ? (
                    <FactOrderCSVButtons 
                      data={factOrder}
                      buttonText={t('common.download')}
                    />
                  ) : (
                    <p className="text-center text-muted-foreground">{t('common.noDataFound')}</p>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-center text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold break-words">
                    {t('dashboard.sales.downloadSalesData')}
                  </h3>
                  {factSales.length > 0 ? (
                    <FactSalesCSVButtons 
                      data={factSales}
                      buttonText={t('common.download')}
                    />
                  ) : (
                    <p className="text-center text-muted-foreground">{t('common.noDataFound')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <SidebarRight filterConfig={FilterConfig} />
        </div>
      </SidebarProvider>
    </RightSidebarProvider>
  )
}