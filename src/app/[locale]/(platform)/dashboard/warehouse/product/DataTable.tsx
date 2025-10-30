import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CSVDownloadButton } from '@/components/ui/CSVDownloadButton'
import type { ColumnConfig } from '@/types'
import { useTranslations } from "next-intl";

// Sales Table Component
export const ProductSalesRangeDiffTable = ({ 
  data,
  dateRange
}: { 
  data: Array<{
    product_name: string;
    sales_quantity: number;
    sales_quantity_target: number;
    quantity_diff: number;
    quantity_diff_abs: number;
  }>;
  dateRange?: { start: string; end: string };
}) => {

  const t = useTranslations()

  const columns: ColumnConfig[] = [
    { key: 'product_name', header: t('product.productName') },
    { key: 'sales_quantity', header: t('dashboard.sales.sales') },
    { key: 'sales_quantity_target', header: t('dashboard.sales.salesTarget') },
    { key: 'quantity_diff', header: t('dashboard.sales.diff') },
    { key: 'quantity_diff_abs', header: t('dashboard.sales.diffAbs') }
  ];

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <CSVDownloadButton
          data={data}
          columns={columns}
          filename={`product-sales-${dateRange?.start || 'report'}`}
          buttonText={t('common.download')}
        />
      </div>
      <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('product.productName')}</TableHead>
              <TableHead className="text-right">{t('dashboard.sales.sales')}</TableHead>
              <TableHead className="text-right">{t('dashboard.sales.salesTarget')}</TableHead>
              <TableHead className="text-right">{t('dashboard.sales.diff')}</TableHead>
              <TableHead className="text-right">{t('dashboard.sales.diffAbs')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{item.product_name}</TableCell>
                <TableCell className="text-right">
                  {item.sales_quantity.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {item.sales_quantity_target.toLocaleString()}
                </TableCell>
                <TableCell className={`text-right ${
                  item.quantity_diff >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.quantity_diff.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {item.quantity_diff_abs.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Order Table Component
export const ProductOrderRangeDiffTable = ({ 
  data,
  dateRange
}: { 
  data: Array<{
    product_name: string;
    order_quantity: number;
    order_quantity_target: number;
    quantity_diff: number;
    quantity_diff_abs: number;
  }>;
  dateRange?: { start: string; end: string };
}) => {

  const t = useTranslations()

  const columns: ColumnConfig[] = [
    { key: 'product_name', header: t('product.productName') },
    { key: 'order_quantity', header: t('dashboard.order.order') },
    { key: 'order_quantity_target', header: t('dashboard.order.orderTarget') },
    { key: 'quantity_diff', header: t('dashboard.sales.diff') },
    { key: 'quantity_diff_abs', header: t('dashboard.sales.diffAbs') }
  ];

  return (
    <div className="space-y-2">
      <div className="flex justify-end">
        <CSVDownloadButton
          data={data}
          columns={columns}
          filename={`product-orders-${dateRange?.start || 'report'}`}
          buttonText={t('common.download')}
        />
      </div>
      <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('product.productName')}</TableHead>
              <TableHead className="text-right">{t('dashboard.order.order')}</TableHead>
              <TableHead className="text-right">{t('dashboard.order.orderTarget')}</TableHead>
              <TableHead className="text-right">{t('dashboard.sales.diff')}</TableHead>
              <TableHead className="text-right">{t('dashboard.sales.diffAbs')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{item.product_name}</TableCell>
                <TableCell className="text-right">
                  {item.order_quantity.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {item.order_quantity_target.toLocaleString()}
                </TableCell>
                <TableCell className={`text-right ${
                  item.quantity_diff >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.quantity_diff.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {item.quantity_diff_abs.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};