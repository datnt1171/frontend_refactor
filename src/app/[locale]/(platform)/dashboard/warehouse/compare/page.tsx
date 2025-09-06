import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import type { PageFilterConfig } from "@/types"

const CompareFilterConfig: PageFilterConfig = {
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

export default function WarehouseComparePage() {
  return (
    <SidebarProvider>
      <RightSidebarProvider>
        <div className="flex flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="sticky top-14 z-10 bg-background border-b">
              <div className="flex items-center gap-2 lg:hidden p-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-4" />
              </div>
            </div>
            
            {/* Main content */}
            <div className="p-2">
              <h1 className="text-2xl font-bold mb-6">Warehouse Aging Report</h1>
              {/* Your page content */}
            </div>
          </div>
          
          <SidebarRight filterConfig={CompareFilterConfig} />
        </div>
      </RightSidebarProvider>
    </SidebarProvider>
  )
}