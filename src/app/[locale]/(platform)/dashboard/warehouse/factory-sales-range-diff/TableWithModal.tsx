'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { ProductModal } from './ProductModal';
import { useTranslations } from 'next-intl';
import type { FactorySalesRangeDiff, ProductSalesRangeDiff } from '@/types';

interface FactoryTableWithModalProps {
  factorySalesRangeDiff: FactorySalesRangeDiff[];
  productSalesRangeDiff: ProductSalesRangeDiff[] | null;
  dateTargetGteMonth: number;
}

export function FactoryTableWithModal({ 
  factorySalesRangeDiff, 
  productSalesRangeDiff,
  dateTargetGteMonth,
}: FactoryTableWithModalProps) {

  const t = useTranslations()
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = {
    date__gte: searchParams.get('date__gte') || '',
    date__lte: searchParams.get('date__lte') || '',
    date_target__gte: searchParams.get('date_target__gte') || '',
    date_target__lte: searchParams.get('date_target__lte') || '',
    factory: searchParams.get('factory') || undefined,
  };
  
  const selectedFactory = params.factory;
  const isModalOpen = !!selectedFactory;
  
  const selectedFactoryData = factorySalesRangeDiff.find(
    f => f.factory_code === selectedFactory
  );

  const handleFactoryClick = (factoryCode: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('factory', factoryCode);
    router.push(`?${newParams.toString()}`);
  };

  const handleCloseModal = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('factory');
    router.push(`?${newParams.toString()}`);
  };

  return (
    <>
      {/* Factory Table */}
      <div className="border bg-white shadow-sm w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#C1FFC1]">
              <TableHead className="border-r font-bold text-center">
                <div>數字順序</div>
                <div>STT</div>
              </TableHead>
              <TableHead className="border-r font-bold text-center">
                <div>客戶代號</div>
                <div>MÃ KH</div>
              </TableHead>
              <TableHead className="border-r font-bold text-center">
                <div>客戶名称</div>
                <div>TÊN KH</div>
              </TableHead>
              <TableHead className="border-r font-bold text-center">
                <div>整個月{dateTargetGteMonth}的送货數量</div>
                <div>SL GIAO HÀNG CẢ THÁNG {dateTargetGteMonth}</div>
              </TableHead>
              <TableHead className="border-r font-bold text-center">
                <div>{params.date_target__gte}→{params.date_target__lte}</div>
                <div>送货数量 SL GIAO HÀNG</div>
              </TableHead>
              <TableHead className="border-r font-bold text-center">
                <div>{params.date__gte}→{params.date__lte}</div>
                <div>送货数量 SL GIAO HÀNG</div>
              </TableHead>
              <TableHead className="border-r font-bold text-center">
                <div>数量差异</div>
                <div>SL CHÊNH LỆCH</div>
              </TableHead>
              <TableHead className="border-r font-bold text-center">
                <div>% 差異</div>
                <div>% CHÊNH LỆCH</div>
              </TableHead>
              <TableHead className="font-bold text-center">
                <div>訂單未交數量</div>
                <div>SL ĐĐH CHƯA GIAO</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {factorySalesRangeDiff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  {t('common.noDataFound')}
                </TableCell>
              </TableRow>
            ) : (
              factorySalesRangeDiff.map((data, index) => (
                <TableRow 
                  key={data.factory_code}
                  onClick={() => handleFactoryClick(data.factory_code)}
                  className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                    selectedFactory === data.factory_code ? 'bg-blue-100' : ''
                  }`}
                >
                  <TableCell className="text-center border-r">{index + 1}</TableCell>
                  <TableCell className="font-bold border-r text-black">
                    {data.factory_code}
                  </TableCell>
                  <TableCell className="border-r">{data.factory_name}</TableCell>
                  <TableCell className={`text-right border-r ${data.whole_month_sales_quantity === 0 ? 'bg-red-300' : ''}`}>
                    {Math.round(data.whole_month_sales_quantity).toLocaleString()}
                  </TableCell>
                  <TableCell className={`text-right border-r ${data.sales_quantity_target === 0 ? 'bg-red-300' : ''}`}>
                    {Math.round(data.sales_quantity_target).toLocaleString()}
                  </TableCell>
                  <TableCell className={`text-right border-r ${data.sales_quantity === 0 ? 'bg-red-300' : ''}`}>
                    {Math.round(data.sales_quantity).toLocaleString()}
                  </TableCell>
                  <TableCell className={`text-right border-r ${data.quantity_diff < 0 ? 'bg-yellow-300' : 'bg-green-200'}`}>
                    {Math.round(data.quantity_diff).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right border-r">
                    {(data.quantity_diff_pct * 100).toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {Math.round(data.planned_deliveries).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedFactoryData && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedFactoryData={selectedFactoryData}
          productData={productSalesRangeDiff || []}
          dateRange={{
            date__gte: params.date__gte,
            date__lte: params.date__lte,
            date_target__gte: params.date_target__gte,
            date_target__lte: params.date_target__lte,
          }}
        />
      )}
    </>
  );
}