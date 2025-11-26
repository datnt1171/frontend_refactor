'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { ProductModal } from './ProductModal';
import { useTranslations } from 'next-intl';
import type { FactoryOrderRangeDiff, ProductOrderRangeDiff } from '@/types';

interface FactoryTableWithModalProps {
  factoryOrderRangeDiff: FactoryOrderRangeDiff[];
  productOrderRangeDiff: ProductOrderRangeDiff[] | null;
  dateTargetGteMonth: number;
}

export function FactoryTableWithModal({ 
  factoryOrderRangeDiff, 
  productOrderRangeDiff,
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
  
  const selectedFactoryData = factoryOrderRangeDiff.find(
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
            <TableRow className="bg-[#DFF2EB]">
              <TableHead className="border-r font-bold text-center">
                <div>數字順序</div>
                <div>STT</div>
              </TableHead>
              <TableHead className="border-r font-bold text-center">
                <div>客戶代號</div>
                <div>MÃ KHÁCH HÀNG</div>
              </TableHead>
              <TableHead className="border-r font-bold text-center">
                <div>客戶名称</div>
                <div>TÊN KHÁCH HÀNG</div>
              </TableHead>
              <TableHead className="border-r font-bold text-center">
                <div>{dateTargetGteMonth}月訂單總數</div>
                <div>ĐĐH cả tháng {dateTargetGteMonth}</div>
              </TableHead>
              <TableHead className="border-r font-bold text-center">
                <div>{params.date_target__gte}→{params.date_target__lte}</div>
                <div>的訂單 SỐ LƯỢNG ĐĐH</div>
              </TableHead>
              <TableHead className="border-r font-bold text-center">
                <div>{params.date__gte}→{params.date__lte}</div>
                <div>的訂單 SỐ LƯỢNG ĐĐH</div>
              </TableHead>
              <TableHead className="border-r font-bold text-center">
                <div>数量差异</div>
                <div>SỐ LƯỢNG CHÊNH LỆCH</div>
              </TableHead>
              <TableHead className="font-bold text-center">
                <div>% 差異</div>
                <div>% CHÊNH LỆCH</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {factoryOrderRangeDiff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  {t('common.noDataFound')}
                </TableCell>
              </TableRow>
            ) : (
              factoryOrderRangeDiff.map((data, index) => (
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
                  <TableCell className={`text-right border-r ${data.whole_month_order_quantity === 0 ? 'bg-red-300' : ''}`}>
                    {Math.round(data.whole_month_order_quantity).toLocaleString()}
                  </TableCell>
                  <TableCell className={`text-right border-r ${data.order_quantity_target === 0 ? 'bg-red-300' : ''}`}>
                    {Math.round(data.order_quantity_target).toLocaleString()}
                  </TableCell>
                  <TableCell className={`text-right border-r ${data.order_quantity === 0 ? 'bg-red-300' : ''}`}>
                    {Math.round(data.order_quantity).toLocaleString()}
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
          productData={productOrderRangeDiff || []}
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