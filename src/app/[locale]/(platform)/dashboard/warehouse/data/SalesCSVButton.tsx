'use client'

import { CSVDownloadButton, type ColumnConfig } from "@/components/ui/CSVDownloadButton"
import type { FactSales } from "@/types"
import { formatDate } from "@/lib/utils/date"
import { useTranslations } from "next-intl"

interface FactSalesCSVButtonsProps {
  data: FactSales[]
  buttonText: string
}

export function FactSalesCSVButtons({ data, buttonText }: FactSalesCSVButtonsProps) {

  const t = useTranslations()
  const Columns: ColumnConfig[] = [
    { header: t('dashboard.sales.salesDate'), key: 'sales_date', transform: (value) => value ? formatDate(value) : '' },
    { header: t('dashboard.sales.salesCode'), key: 'sales_code' },
    { header: t('dashboard.sales.orderCode'), key: 'order_code' },
    { header: t('dashboard.sales.factoryOrderCode'), key: 'factory_order_code' },
    { header: t('dashboard.sales.factoryCode'), key: 'factory_code' },
    { header: t('dashboard.sales.factoryName'), key: 'factory_name' },
    { header: t('dashboard.sales.productCode'), key: 'product_code' },
    { header: t('dashboard.sales.productName'), key: 'product_name' },
    { header: t('dashboard.sales.qc'), key: 'qc' },
    { header: t('dashboard.sales.department'), key: 'department' },
    { header: t('dashboard.sales.salesman'), key: 'salesman' },
    { header: t('dashboard.sales.salesQuantity'), key: 'sales_quantity' },
    { header: t('dashboard.sales.unit'), key: 'unit' },
    { header: t('dashboard.sales.packageSalesQuantity'), key: 'package_sales_quantity' },
    { header: t('dashboard.sales.packageUnit'), key: 'package_unit' },
    { header: t('dashboard.sales.warehouseCode'), key: 'warehouse_code' },
    { header: t('dashboard.sales.warehouseType'), key: 'warehouse_type' },
    { header: t('dashboard.sales.importCode'), key: 'import_code' },
    { header: t('dashboard.sales.importTimestamp'), key: 'import_timestamp', transform: (value) => value ? formatDate(value) : '' },
    { header: t('dashboard.sales.importWhTimestamp'), key: 'import_wh_timestamp', transform: (value) => value ? formatDate(value) : '' },
    ];

  return (
    <div className="flex gap-2">
      <CSVDownloadButton
        data={data}
        columns={Columns}
        filename="GIAOHANG"
        buttonText={buttonText}
        className="w-full"
      />
    </div>
  )
}