'use client'

import { CSVDownloadButton, type ColumnConfig } from "@/components/ui/CSVDownloadButton"
import type { TripLog } from "@/types"
import { formatDateToUTC7 } from "@/lib/utils/date"
import { useTranslations } from "next-intl"

interface TripLogCSVButtonProps {
  data: TripLog[]
}

export function TripLogCSVButton({ data }: TripLogCSVButtonProps) {
  const t = useTranslations()

  const Columns: ColumnConfig[] = [
    { header: t('common.date'), key: 'date', transform: (value) => formatDateToUTC7(value, 'date') },
    { header: t('fleet.trip.licensePlate'), key: 'license_plate' },
    { header: t('fleet.trip.driver'), key: 'username' },
    { header: t('fleet.trip.startLocation'), key: 'start_loc_factory_name' },
    { header: t('fleet.trip.endLocation'), key: 'end_loc_factory_name' },
    { header: t('fleet.trip.startOdometer'), key: 'start_odometer' },
    { header: t('fleet.trip.endOdometer'), key: 'end_odometer' },
    { header: t('fleet.trip.distance'), key: 'distance' },
    { header: t('fleet.trip.startTime'), key: 'start_time', transform: (value) => formatDateToUTC7(value, 'full') },
    { header: t('fleet.trip.endTime'), key: 'end_time', transform: (value) => formatDateToUTC7(value, 'full') },
    { header: t('taskManagement.action.duration'), key: 'duration' },
    { header: t('fleet.stop.tollStation'), key: 'toll_station', transform: (value) => value || '-' }

  ]

  return (
    <CSVDownloadButton
      data={data}
      columns={Columns}
      filename="trip_log"
      buttonText={t('common.download')}
    />
  )
}