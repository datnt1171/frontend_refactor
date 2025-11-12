'use client'

import { CSVDownloadButton, type ColumnConfig } from "@/components/ui/CSVDownloadButton"
import type { FactOrder } from "@/types"
import { formatDate } from "@/lib/utils/date"
import { useTranslations } from "next-intl"

interface FactOrderCSVButtonsProps {
  data: FactOrder[]
  buttonText: string
}

export function FactOrderCSVButtons({ data, buttonText }: FactOrderCSVButtonsProps) {

  const t = useTranslations()
  const Columns: ColumnConfig[] = [
    { header: t('dashboard.order.orderDate'), key: 'order_date', transform: (value) => value ? formatDate(value) : '' },
    { header: t('dashboard.order.orderCode'), key: 'order_code' },
    { header: t('dashboard.order.ctDate'), key: 'ct_date', transform: (value) => value ? formatDate(value) : '' },
    { header: t('dashboard.order.factoryCode'), key: 'factory_code' },
    { header: t('dashboard.order.factoryName'), key: 'factory_name' },
    { header: t('dashboard.order.factoryOrderCode'), key: 'factory_order_code' },
    { header: t('dashboard.order.taxType'), key: 'tax_type' },
    { header: t('dashboard.order.department'), key: 'department' },
    { header: t('dashboard.order.salesman'), key: 'salesman' },
    { header: t('dashboard.order.depositRate'), key: 'deposit_rate' },
    { header: t('dashboard.order.paymentRegistrationCode'), key: 'payment_registration_code' },
    { header: t('dashboard.order.paymentRegistrationName'), key: 'payment_registration_name' },
    { header: t('dashboard.order.deliveryAddress'), key: 'delivery_address' },
    { header: t('dashboard.order.productCode'), key: 'product_code' },
    { header: t('dashboard.order.productName'), key: 'product_name' },
    { header: t('dashboard.order.qc'), key: 'qc' },
    { header: t('dashboard.order.warehouseType'), key: 'warehouse_type' },
    { header: t('dashboard.order.orderQuantity'), key: 'order_quantity' },
    { header: t('dashboard.order.deliveredQuantity'), key: 'delivered_quantity' },
    { header: t('dashboard.order.packageOrderQuantity'), key: 'package_order_quantity' },
    { header: t('dashboard.order.deliveredPackageOrderQuantity'), key: 'delivered_package_order_quantity' },
    { header: t('dashboard.order.unit'), key: 'unit' },
    { header: t('dashboard.order.packageUnit'), key: 'package_unit' },
    { header: t('dashboard.order.estimatedDeliveryDate'), key: 'estimated_delivery_date', transform: (value) => value ? formatDate(value) : '' },
    { header: t('dashboard.order.originalEstimatedDeliveryDate'), key: 'original_estimated_delivery_date', transform: (value) => value ? formatDate(value) : '' },
    { header: t('dashboard.order.preCt'), key: 'pre_ct' },
    { header: t('dashboard.order.finishCode'), key: 'finish_code' },
    { header: t('dashboard.order.importTimestamp'), key: 'import_timestamp', transform: (value) => value ? formatDate(value) : '' },
    { header: t('dashboard.order.importWhTimestamp'), key: 'import_wh_timestamp', transform: (value) => value ? formatDate(value) : '' },
    ];

  return (
    <div className="flex gap-2">
      <CSVDownloadButton
        data={data}
        columns={Columns}
        filename="ĐĐH"
        buttonText={buttonText}
        className="w-full"
      />
    </div>
  )
}