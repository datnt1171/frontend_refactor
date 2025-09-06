import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import type { PageFilterConfig } from "@/types"

const warehouseAgingFilterConfig: PageFilterConfig = {
  showApplyButton: true,
  showResetButton: true,
  filters: [
    {
      id: 'years',
      type: 'checkbox',
      label: 'Years',
      options: [
        { value: '2021', label: '2021' },
        { value: '2022', label: '2022' },
        { value: '2023', label: '2023' },
        { value: '2024', label: '2024' },
        { value: '2025', label: '2025' },
      ]
    },
    {
      id: 'months',
      type: 'combobox',
      label: 'Months',
      searchable: true,
      placeholder: 'Select months...',
      options: [
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
      ]
    },
    {
      id: 'aging_days',
      type: 'day-range',
      label: 'Aging Days',
      min: 1,
      max: 365
    },
    {
      id: 'warehouse',
      type: 'select',
      label: 'Warehouse',
      placeholder: 'Select warehouse...',
      options: [
        { value: 'wh1', label: 'Warehouse 1' },
        { value: 'wh2', label: 'Warehouse 2' },
        { value: 'wh3', label: 'Warehouse 3' },
      ]
    },
    {
      id: 'sort',
      type: 'select',
      label: 'Sort By',
      options: [
        { value: 'aging_desc', label: 'Aging (Oldest First)' },
        { value: 'aging_asc', label: 'Aging (Newest First)' },
        { value: 'value_desc', label: 'Value (High to Low)' },
        { value: 'value_asc', label: 'Value (Low to High)' },
      ]
    },
    {
      id: 'date_range',
      type: 'date-range',
      label: 'Date Range'
    },
    {
      id: 'search',
      type: 'search',
      label: 'Search Items',
      placeholder: 'Search by item name, SKU...'
    }
  ],
  defaultValues: {
    sort: 'aging_desc'
  }
}

export default function WarehouseAgingPage() {
  return (
    <SidebarProvider>
      <RightSidebarProvider>
        <div className="flex flex-1 min-w-0">
          <div className="flex items-center gap-2 lg:hidden p-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
          </div>
          
          <div className="flex-1 min-w-0 p-6">
            <h1 className="text-2xl font-bold mb-6">Warehouse Aging Report</h1>
            {/* Your page content */}
          </div>
          
          <SidebarRight filterConfig={warehouseAgingFilterConfig} />
        </div>
      </RightSidebarProvider>
    </SidebarProvider>
  )
}