'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SalesVsTargetChart from '../product/SalesVsTarget';
import SalesDiffChart from '../product/SalesDiff';
import { ProductSalesRangeDiffTable } from '../product/DataTable';
import type { ProductSalesRangeDiff } from '@/types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  factoryName: string;
  factoryCode: string;
  productData: ProductSalesRangeDiff[];
  dateRange: {
    date__gte: string;
    date__lte: string;
    date_target__gte: string;
    date_target__lte: string;
  };
}

export function ProductModal({
  isOpen,
  onClose,
  factoryName,
  factoryCode,
  productData,
  dateRange
}: ProductModalProps) {
  
  // Prepare chart data (top 5 and bottom 5)
  const first5AndLast5Sales = productData.length > 0 ? [
    ...productData.slice(0, 5),
    ...productData.slice(-5)
  ] : [];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent 
        className="w-[95vw] h-[95vh] max-h-[95vh] overflow-y-auto p-6"
        style={{ maxWidth: '95vw' }}
        >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl">
              <div className="font-bold">{factoryName} ({factoryCode})</div>
              <div className="text-sm font-normal text-gray-600 mt-1">
                Giao hàng theo SP - 按產品分列的銷售額
              </div>
              <div className="text-sm font-normal text-gray-600">
                {dateRange.date_target__gte}→{dateRange.date_target__lte} ~ {dateRange.date__gte}→{dateRange.date__lte}
              </div>
            </DialogTitle>
          </div>
        </DialogHeader>

        {productData && productData.length > 0 ? (
          <div className="space-y-6 mt-4">
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SalesVsTargetChart data={first5AndLast5Sales} />
              <SalesDiffChart data={first5AndLast5Sales} />
            </div>

            {/* Product Table */}
            <div className="mt-6">
              <ProductSalesRangeDiffTable 
                data={productData} 
                dateRange={{ 
                  start: dateRange.date__gte, 
                  end: dateRange.date__lte 
                }}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            沒有產品數據 / No product data available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}