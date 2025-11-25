import { getUsers, getUserFactoryOnsite, getFactories } from '@/lib/api/server'
import { UserFactoryOnsiteMatrix } from './components/UserFactoryOnsiteMatrix'
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import type { PageFilterConfig } from "@/types"
import { generateYearOptions, getCurrentYear } from '@/lib/utils/date';
import { getTranslations, getLocale } from "next-intl/server"
import { redirectWithDefaults } from "@/lib/utils/filter"

interface PageProps {
  searchParams: Promise<{
    year: string
  }>
}

export default async function Page({ searchParams }: PageProps) {

  const params = await searchParams
  const locale = await getLocale()
  const t = await getTranslations()

  const defaultParams = {
    year: getCurrentYear()
  }

  redirectWithDefaults({
    currentParams: params,
    defaultParams,
    pathname: '/user/onsite',
    locale
  });

  const FilterConfig: PageFilterConfig = {
    showResetButton: true,

    filters: [
      {
        id: 'year',
        type: 'select',
        label: t('filter.selectYear'),
        options: generateYearOptions({ yearsBack: 3 })
        
      }
    ]
  }


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
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />

        <UserFactoryOnsiteMatrix 
          users={users.results}
          onsiteData={onsiteData}
          factories={factories.results}
        />
      </SidebarInset>
      
      <SidebarRight filterConfig={FilterConfig} />
    </SidebarProvider>
  )
}