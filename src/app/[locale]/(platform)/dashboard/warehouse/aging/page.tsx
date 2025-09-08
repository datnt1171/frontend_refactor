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
      id: 'categories',
      type: 'multiselect',
      label: 'Categories',
      placeholder: 'Select categories...',
      options: [
        { value: 'tech', label: 'Technology' },
        { value: 'design', label: 'Design' }
      ]
    },
    {
      id: 'author',
      type: 'combobox',
      label: 'Author',
      placeholder: 'Select author...',
      options: [
        { value: 'john', label: 'John Doe', searchValue: 'John Doe john' }
      ]
    },
    {
      id: 'sort',
      type: 'sort',
      label: 'Sort Options',
      placeholder: 'Select sort order...',
      sortFields: [
        { value: 'created_at', label: 'Created Date' },
        { value: 'updated_at', label: 'Updated Date' },
        { value: 'title', label: 'Title' },
        { value: 'author', label: 'Author' }
      ]
    }
  ],
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