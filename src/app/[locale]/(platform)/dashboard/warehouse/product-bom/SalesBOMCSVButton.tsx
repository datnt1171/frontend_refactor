'use client'

import { CSVDownloadButton, type ColumnConfig } from "@/components/ui/CSVDownloadButton"
import type { SalesBOM } from "@/types"
import { useTranslations } from "next-intl"

interface SalesBOMCSVButtonsProps {
  data: SalesBOM[]
  buttonText: string
  groupBy?: string | null
}

export function SalesBOMCSVButtons({ data, buttonText, groupBy }: SalesBOMCSVButtonsProps) {

  const t = useTranslations()
  
  // Parse groupBy to determine which columns to show
  const groupByColumns = groupBy ? groupBy.split(',').map(col => col.trim()) : []
  
  // Build columns dynamically based on groupBy
  const columns: ColumnConfig[] = []
  
  if (groupByColumns.includes('factory_code')) {
    columns.push({ header: t('crm.factories.factoryId'), key: 'factory_code' })
  }
  
  if (groupByColumns.includes('factory_name')) {
    columns.push({ header: t('crm.factories.factoryName'), key: 'factory_name' })
  }
  
  if (groupByColumns.includes('product_name')) {
    columns.push({ header: t('product.productName'), key: 'product_name' })
    columns.push({ header: t('dashboard.sales.salesQuantity'), key: 'sales_quantity' })
  }
  
  // material_name is always included
  columns.push({ header: t('material.materialName'), key: 'material_name' })


  if (groupByColumns.includes('product_name')) {
    columns.push({ header: t('product.ratio'), key: 'ratio' })
  }

  // material_name is always included
  columns.push({ header: t('material.materialQuantity'), key: 'material_quantity' })

  return (
    <div className="flex gap-2">
      <CSVDownloadButton
        data={data}
        columns={columns}
        filename="SALES_BOM"
        buttonText={buttonText}
        className="w-full"
      />
    </div>
  )
}