import { getTrips } from '@/lib/api/server'
import { getTranslations } from 'next-intl/server'
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus } from "lucide-react"
import { DataPagination } from "@/components/dashboard/Pagination"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import type { PageFilterConfig } from "@/types"


interface ProcessPageProps {
  searchParams: Promise<{
    search?: string,
    page?: string
    page_size?: string
  }>
}


export default async function ProcessPage({searchParams}: ProcessPageProps) {
  const t = await getTranslations('taskManagement.process')

  const FilterConfig: PageFilterConfig = {
    showResetButton: true,
    defaultValues: {
      page_size: '15',
      page: '1'
    },
    filters: [
      {
        id: 'search',
        type: 'search',
        label: 'Search Process',
        placeholder: 'Search by process name'
      }
    ]
  }

  const params = await searchParams
  const response = await getTrips(params)
  const trips = response.results

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
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('useForm')}</h1>
                    <p className="text-muted-foreground mt-2">{t('useForm')}</p>
                  </div>
                  <Link href="/fleet/trips/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      {t('useForm')}
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
                            <span className="text-muted-foreground">Driver</span>
                            <span className="font-medium">{trip.driver_name}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Plate</span>
                            <span className="font-medium">{trip.license_plate}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Stops</span>
                            <span className="font-medium">{trip.stops_count}</span>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="bg-muted/50 pt-3">
                        <Link href={`/fleet/trips/${trip.id}`} className="w-full">
                          <Button className="w-full">
                            {t('useForm')}
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {trips.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">{t('noFormFound')}</h3>
                    <p className="text-muted-foreground mt-2">{t('tryAdjustingSearchOrCreate')}</p>
                  </div>
                )}
              </div>
              <DataPagination
                totalCount={response.count}
              />
            </div>
          </div>
          <SidebarRight filterConfig={FilterConfig} />
        </div>
      </SidebarProvider>
    </RightSidebarProvider>
  )
}
