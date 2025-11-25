import { getTrips } from '@/lib/api/server'
import { getTranslations, getLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus } from "lucide-react"
import { DataPagination } from "@/components/dashboard/Pagination"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import type { PageFilterConfig } from "@/types"
import { redirectWithDefaults } from "@/lib/utils/filter"


interface ProcessPageProps {
  searchParams: Promise<{
    license_plate?: string
    search?: string,
    page?: string
    page_size?: string
  }>
}


export default async function ProcessPage({searchParams}: ProcessPageProps) {

  const params = await searchParams
  const locale = await getLocale()
  const t = await getTranslations()

  const defaultParams = {
    page_size: '15',
    page: '1'
  }

  redirectWithDefaults({
    currentParams: params,
    defaultParams,
    pathname: '/fleet/trips',
    locale
  });

  const FilterConfig: PageFilterConfig = {
    showResetButton: true,
    isPaginated: true,

    filters: [
      {
        id: 'date',
        type: 'date',
        label: t('filter.selectDate'),
        placeholder: t('filter.selectDate')
      },
      {
        id: 'search',
        type: 'search',
        label: t('filter.searchLicensePlate'),
        placeholder: t('filter.searchLicensePlateHolder')
      }
    ]
  }

  const response = await getTrips(params)
  const trips = response.results

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('fleet.trip.trip')}</h1>
              <p className="text-muted-foreground mt-2">{t('fleet.trip.tripDescription')}</p>
            </div>
            <Link href="/fleet/trips/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('fleet.trip.createTrip')}
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <Card key={trip.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                    {trip.date}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                  <div className="rounded-md bg-muted/40 px-3 py-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t('fleet.trip.driver')}</span>
                      <span className="font-medium">{trip.driver_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t('fleet.trip.licensePlate')}</span>
                      <span className="font-medium">{trip.license_plate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t('fleet.stop.stop')}</span>
                      <span className="font-medium">{trip.stops_count}</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-muted/50 pt-3">
                  <Link href={`/fleet/trips/${trip.id}`} className="w-full">
                    <Button className="w-full">
                      {t('common.viewDetails')}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {trips.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">{t('common.noDataFound')}</h3>
            </div>
          )}
        </div>
        <DataPagination
          totalCount={response.count}
        />
      </SidebarInset>
      
      <SidebarRight filterConfig={FilterConfig} />
    </SidebarProvider>
  )
}
