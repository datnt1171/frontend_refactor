import { getUsers, getUserFactoryOnsite, getFactories } from '@/lib/api/server'
import { UserFactoryOnsiteMatrix } from './components/UserFactoryOnsiteMatrix'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import type { PageFilterConfig } from "@/types"
import { generateYearOptions, getCurrentYear } from '@/lib/utils/date';

const FilterConfig: PageFilterConfig = {
  showResetButton: true,
  defaultValues: {
    year: getCurrentYear()
  },
  filters: [
    {
      id: 'year',
      type: 'select',
      label: 'Select Year',
      options: generateYearOptions({ yearsBack: 3 })
      
    }
  ]
}

interface PageProps {
  searchParams: Promise<{
    year: string
  }>
}


export default async function UserFactoryOnsitePage({ searchParams }: PageProps) {

  const params = await searchParams
  // Fetch users and onsite data in parallel
  const [users, onsiteData, factories] = await Promise.all([
    getUsers({
    'department__name__in': 'KTC,KTW,KVN',
    'role__name__in': 'technician',
    'page_size': '999999',
    'page': '1',
    'ordering': 'username'
    }),
    getUserFactoryOnsite(params),
    getFactories({
      'is_active': 'true', 
      'has_onsite': 'true',
      'page_size': '999999',
      'page': '1'
    })
  ])

  return (
    <RightSidebarProvider>
      <SidebarProvider>
        <div className="flex flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="sticky top-14 z-10 bg-background px-2">
              <div className="flex items-center gap-2 lg:hidden">
                <SidebarTrigger />
                <span className="text-sm font-medium">Filter</span>
              </div>
              <UserFactoryOnsiteMatrix 
                users={users.results}
                onsiteData={onsiteData}
                factories={factories.results}
              />
            </div>
          </div>
          <SidebarRight filterConfig={FilterConfig} />
        </div>
      </SidebarProvider>
    </RightSidebarProvider>
  )
}