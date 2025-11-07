import { Card, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreateStopForm } from './CreateStopForm'
import { EditStopForm } from './EditStopForm'
import { DeleteStopButton } from './DeleteStopButton'
import { getTrip } from '@/lib/api/server'
import { formatDateToUTC7 } from '@/lib/utils/date'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const trip = await getTrip(id)
  
  const lastStopOdometer = trip.stops.length > 0 
    ? Math.max(...trip.stops.map(s => s.odometer))
    : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold truncate">{trip.driver_name}</h1>
            <Badge variant="secondary">{trip.stops_count} stops</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="truncate">{trip.license_plate}</span>
            <span>{formatDateToUTC7(trip.date, 'date')}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 space-y-3">
        {trip.stops.map((stop, index) => {
          const prevStop = index > 0 ? trip.stops[index - 1] : null
          const prevStopOdometer = prevStop ? prevStop.odometer : 0
          
          return (
            <Card key={stop.id}>
              <CardHeader className="pb-2 pt-3 px-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-semibold">#{stop.order}</span>
                    <span className="text-sm truncate">{stop.factory_name} ({stop.location})</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Badge variant="outline" className="text-xs px-1.5 py-0">
                      {stop.odometer.toLocaleString()}
                    </Badge>
                    <EditStopForm
                      stop={stop}
                      prevStopOdometer={prevStopOdometer}
                    />
                    <DeleteStopButton stopId={stop.id} />
                  </div>
                </div>
                {stop.toll_station && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Trạm {stop.toll_station}
                  </p>
                )}
              </CardHeader>
            </Card>
          )
        })}

        <CreateStopForm
          tripId={trip.id}
          stopsCount={trip.stops_count}
          lastStopOdometer={lastStopOdometer}
        />
      </div>
    </div>
  )
}