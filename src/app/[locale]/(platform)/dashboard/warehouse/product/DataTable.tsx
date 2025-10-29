import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Sales Table Component
export const ProductSalesRangeDiffTable = ({ 
  data 
}: { 
  data: Array<{
    product_name: string;
    sales_quantity: number;
    sales_quantity_target: number;
    quantity_diff: number;
    quantity_diff_abs: number;
  }>;
}) => {
  return (
    <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Sales Qty</TableHead>
            <TableHead className="text-right">Target Qty</TableHead>
            <TableHead className="text-right">Diff</TableHead>
            <TableHead className="text-right">Diff Abs</TableHead>
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
  );
};

// Order Table Component
export const ProductOrderRangeDiffTable = ({ 
  data 
}: { 
  data: Array<{
    product_name: string;
    order_quantity: number;
    order_quantity_target: number;
    quantity_diff: number;
    quantity_diff_abs: number;
  }>;
}) => {
  return (
    <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Order Qty</TableHead>
            <TableHead className="text-right">Target Qty</TableHead>
            <TableHead className="text-right">Diff</TableHead>
            <TableHead className="text-right">Diff Abs</TableHead>
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
  );
};