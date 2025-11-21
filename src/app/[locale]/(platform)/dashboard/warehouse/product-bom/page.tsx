import { getSalesBOM, getOrderBOM, getMaxSalesDate } from '@/lib/api/server';
import { getFactoryOptions } from '@/lib/utils/filter';
import { getTranslations } from "next-intl/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import type { PageFilterConfig } from "@/types"
import { format, startOfMonth } from 'date-fns'
import { SalesBOMCSVButtons } from './SalesBOMCSVButton';
import { OrderBOMCSVButtons } from './OrderBOMCSVButton';

interface PageProps {
  searchParams: Promise<{
    date__gte: string
    date__lte: string
    factory: string
    group_by: string
  }>
}

export default async function Page({ searchParams }: PageProps) {

  const t = await getTranslations()

  const maxSalesDate = await getMaxSalesDate()
  const today = new Date(maxSalesDate)

  const firstDateOfMonth = startOfMonth(today);

  const FilterConfig: PageFilterConfig = {
    showResetButton: false,
    autoApplyFilters: false,
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
      },
      {
        id: 'group_by',
        type: "select",
        label: t('filter.groupBy'),
        placeholder: t('filter.groupBy'),
        options: [
          { value: "material_name", label: t('material.materialName') },
          { value: "factory_code,factory_name", label: t('crm.factories.factoryName') },
          { value: "product_name", label: t('product.productName') },
          { value: "factory_code,factory_name,product_name", label: t('crm.factories.factoryName') + ", " + t('product.productName') },
        ]
      }
    ]
  }

  const params = await searchParams

  const salesBOM = await getSalesBOM(params)
  const orderBOM = await getOrderBOM(params)

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />

        {/* Data download */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-center text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold break-words">
                {t('dashboard.order.downloadOrderData')}
              </h3>
              {orderBOM.length > 0 ? (
                <OrderBOMCSVButtons 
                  data={orderBOM}
                  buttonText={t('common.download')}
                  groupBy={params.group_by}
                />
              ) : (
                <p className="text-center text-muted-foreground">{t('common.noDataFound')}</p>
              )}
            </div>
  
            <div className="flex flex-col gap-4">
              <h3 className="text-center text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold break-words">
                {t('dashboard.sales.downloadSalesData')}
              </h3>
              {salesBOM.length > 0 ? (
                <SalesBOMCSVButtons 
                  data={salesBOM}
                  buttonText={t('common.download')}
                  groupBy={params.group_by}
                />
              ) : (
                <p className="text-center text-muted-foreground">{t('common.noDataFound')}</p>
              )}
            </div>
          </div>
        
      </SidebarInset>
      
      <SidebarRight filterConfig={FilterConfig} />
    </SidebarProvider>
  )
}