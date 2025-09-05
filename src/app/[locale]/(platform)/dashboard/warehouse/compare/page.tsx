import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import type { PageFilterConfig } from "@/types"

const salesOrdersFilterConfig: PageFilterConfig = {
  showApplyButton: false, // Auto-apply filters
  filters: [
    {
      id: 'status',
      type: 'checkbox',
      label: 'Order Status',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' },
      ]
    },
    {
      id: 'customer_type',
      type: 'select',
      label: 'Customer Type',
      options: [
        { value: 'retail', label: 'Retail' },
        { value: 'wholesale', label: 'Wholesale' },
        { value: 'corporate', label: 'Corporate' },
      ]
    },
    {
      id: 'amount_range',
      type: 'day-range', // Reusing for amount range
      label: 'Amount Range ($)',
      min: 0,
      max: 10000
    },
    {
      id: 'search',
      type: 'search',
      label: 'Search Orders',
      placeholder: 'Order ID, customer name...'
    }
  ]
}

export default function salesOrdersFilterpage() {
  return (
    <RightSidebarProvider>
      <div className="flex flex-1 min-w-0">
        <div className="flex-1 min-w-0 p-6">
          <h1 className="text-2xl font-bold mb-6">Warehouse Aging Report</h1>
          {/* Your page content */}
        </div>
        <SidebarRight filterConfig={salesOrdersFilterConfig} />
      </div>
    </RightSidebarProvider>
  )
}