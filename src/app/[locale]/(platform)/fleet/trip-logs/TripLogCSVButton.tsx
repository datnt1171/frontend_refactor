'use client'

import { CSVDownloadButton, type ColumnConfig } from "@/components/ui/CSVDownloadButton"
import type { TripLog } from "@/types"
import { formatDateToUTC7 } from "@/lib/utils/date"

interface TripLogCSVButtonProps {
  data: TripLog[]
}

export function TripLogCSVButton({ data }: TripLogCSVButtonProps) {
  const Columns: ColumnConfig[] = [
    { header: 'Date', key: 'date', transform: (value) => formatDateToUTC7(value, 'date') },
    { header: 'License Plate', key: 'license_plate' },
    { header: 'Driver', key: 'username' },
    { header: 'Start Location', key: 'start_loc' },
    { header: 'End Location', key: 'end_loc' },
    { header: 'Start Odometer', key: 'start_odometer' },
    { header: 'End Odometer', key: 'end_odometer' },
    { header: 'Distance', key: 'distance' },
    { header: 'Start Time', key: 'start_time', transform: (value) => formatDateToUTC7(value, 'full') },
    { header: 'End Time', key: 'end_time', transform: (value) => formatDateToUTC7(value, 'full') },
    { header: 'Duration (min)', key: 'duration'},
    { header: 'Toll Station', key: 'toll_station', transform: (value) => value || '-' }
  ]

  return (
    <CSVDownloadButton
      data={data}
      columns={Columns}
      filename="trip_log"
      buttonText="Download CSV"
    />
  )
}