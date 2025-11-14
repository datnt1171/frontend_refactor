import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import type { PageFilterConfig } from "@/types"

const FilterConfig: PageFilterConfig = {
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
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />

        <div className="flex-1 min-w-0 p-6">
          <h1 className="text-2xl font-bold mb-6">Warehouse Aging Report</h1>
          {/* Your page content */}
        </div>
      </SidebarInset>
      
      <SidebarRight filterConfig={FilterConfig} />
    </SidebarProvider>
  )
}