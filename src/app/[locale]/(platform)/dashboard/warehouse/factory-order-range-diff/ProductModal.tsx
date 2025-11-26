'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import OrderVsTargetChart from '../product/OrderVsTarget';
import OrderDiffChart from '../product/OrderDiff';
import { ProductOrderRangeDiffTable } from '../product/DataTable';
import type { FactoryOrderRangeDiff, ProductOrderRangeDiff } from '@/types';
import { useTranslations } from 'next-intl';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFactoryData: FactoryOrderRangeDiff;
  productData: ProductOrderRangeDiff[];
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
  selectedFactoryData,
  productData,
  dateRange
}: ProductModalProps) {
  
  const t = useTranslations()
  const [minQuantityDiff, setMinQuantityDiff] = useState(500);
  const [showProductTable, setShowProductTable] = useState(false);

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
                {selectedFactoryData.factory_name} ({selectedFactoryData.factory_code}):{' '}
                <span className={selectedFactoryData.quantity_diff >= 0 ? "text-green-600" : "text-red-600"}>
                   {t(`dashboard.warehouse.factoryOrderRangeDiff.${selectedFactoryData.quantity_diff >= 0 ? 'increase' : 'decrease'}`)} 
                   {selectedFactoryData.quantity_diff.toLocaleString()}
                </span>
              </div>
              <div className="text-sm font-normal text-gray-600 mt-1">
                Đơn đặt hàng theo SP - 按產品排序
              </div>
              <div className="text-sm font-normal text-gray-600">
                {dateRange.date_target__gte}→{dateRange.date_target__lte} ~ {dateRange.date__gte}→{dateRange.date__lte}
              </div>
            </DialogTitle>

            {/* Filter Input - Right side */}
            <div className="flex items-center gap-3 shrink-0">
              <label className="text-sm font-medium whitespace-nowrap">
                 {t('dashboard.order.order')} ≥
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
              <OrderDiffChart data={filteredProducts} />
              <OrderVsTargetChart data={filteredProducts} />
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
                <ProductOrderRangeDiffTable 
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
            {t('common.noDataFound')}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}