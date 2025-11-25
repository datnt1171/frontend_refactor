'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import SalesVsTargetChart from '../product/SalesVsTarget';
import SalesDiffChart from '../product/SalesDiff';
import { ProductSalesRangeDiffTable } from '../product/DataTable';
import type { ProductSalesRangeDiff } from '@/types';
import { useTranslations } from 'next-intl';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  factoryName: string;
  factoryCode: string;
  quantityDiff: number;
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
  quantityDiff,
  productData,
  dateRange
}: ProductModalProps) {
  
  const t = useTranslations()
  const [minQuantityDiff, setMinQuantityDiff] = useState(500);
  const [showProductTable, setShowProductTable] = useState(true);

  // Filter products based on minimum quantity_diff_abs
  const filteredProducts = productData.filter(
    product => product.quantity_diff_abs >= minQuantityDiff
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent 
        className="w-[95vw] h-[95vh] max-h-[95vh] overflow-y-auto p-6"
        style={{ maxWidth: '95vw' }}
      >
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-lg sm:text-xl flex-1">
              <div className="font-bold">
                {factoryName} ({factoryCode}):{' '}
                <span className={quantityDiff >= 0 ? "text-green-600" : "text-red-600"}>
                   {t(`dashboard.warehouse.factorySalesRangeDiff.${quantityDiff >= 0 ? 'increase' : 'decrease'}`)} 
                   {quantityDiff.toLocaleString()}
                </span>
              </div>
              <div className="text-sm font-normal text-gray-600 mt-1">
                Giao hàng theo SP - 按產品分列的銷售額
              </div>
              <div className="text-sm font-normal text-gray-600">
                {dateRange.date_target__gte}→{dateRange.date_target__lte} ~ {dateRange.date__gte}→{dateRange.date__lte}
              </div>
            </DialogTitle>

            {/* Filter Input - Right side */}
            <div className="flex items-center gap-3 shrink-0">
              <label className="text-sm font-medium whitespace-nowrap">
                最小差異 / Min Diff:
              </label>
              <input
                type="number"
                value={minQuantityDiff}
                onChange={(e) => setMinQuantityDiff(Number(e.target.value) || 0)}
                className="w-32 px-3 py-2 border rounded-md"
                min="0"
                step={100}
              />
              <span className="text-sm text-gray-500 whitespace-nowrap">
                ({filteredProducts.length} / {productData.length})
              </span>
            </div>
          </div>
        </DialogHeader>

        {productData && productData.length > 0 ? (
          <div className="space-y-6 mt-4">
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SalesDiffChart data={filteredProducts} />
              <SalesVsTargetChart data={filteredProducts} />
            </div>

            {/* Product Table Toggle & Content */}
            <div className="mt-6">
              <Button
                onClick={() => setShowProductTable(!showProductTable)}
                variant="outline"
                className="mb-4"
              >
                {showProductTable ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    {t('common.viewDetails')}
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    {t('common.viewDetails')}
                  </>
                )}
              </Button>

              {showProductTable && (
                <ProductSalesRangeDiffTable 
                  data={productData} 
                  dateRange={{ 
                    start: dateRange.date__gte, 
                    end: dateRange.date__lte 
                  }}
                />
              )}
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