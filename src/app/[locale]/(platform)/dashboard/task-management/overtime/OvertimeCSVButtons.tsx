'use client'

import { CSVDownloadButton, type ColumnConfig } from "@/components/ui/CSVDownloadButton"
import type { Overtime } from "@/types"
import { addDayToDate, formatDate } from "@/lib/utils/date"

interface OvertimeCSVButtonsProps {
  data: Overtime[]
}

export function OvertimeCSVButtons({ data }: OvertimeCSVButtonsProps) {
  const todayColumns: ColumnConfig[] = [
    { header: 'Created At', key: 'created_at', transform: (value) => formatDate(value) },
    { header: 'Factory Code', key: 'factory_code' },
    { header: 'Factory Name', key: 'factory_name' },
    { header: 'OT Start', key: 'weekday_ot_start' },
    { header: 'OT End', key: 'weekday_ot_end' },
    { header: 'OT Number', key: 'weekday_ot_num' },
    { header: 'Pallet Line Today', key: 'pallet_line_today' },
    { header: 'Hanging Line Today', key: 'hanging_line_today' },
    { header: 'Others Today', key: 'others_today' },
    { header: 'In Stock', key: 'instock' },
    { header: 'In Stock by Code', key: 'instock_by_code' }
  ]

  const tomorrowColumns: ColumnConfig[] = [
    { 
      header: 'Tomorrow Date', 
      key: 'created_at', 
      transform: (value) => formatDate(addDayToDate(value, 1)) 
    },
    { header: 'Factory Code', key: 'factory_code' },
    { header: 'Factory Name', key: 'factory_name' },
    { header: 'Hanging Line Tomorrow', key: 'hanging_line_tomorrow' },
    { header: 'Pallet Line Tomorrow', key: 'pallet_line_tomorrow' },
    { header: 'Others Tomorrow', key: 'others_tomorrow' }
  ]

  const sundayColumns: ColumnConfig[] = [
    { header: 'Created At', key: 'created_at', transform: (value) => formatDate(value) },
    { header: 'Factory Code', key: 'factory_code' },
    { header: 'Factory Name', key: 'factory_name' },
    { header: 'Sunday OT', key: 'sunday_ot' },
    { header: 'Sunday OT End', key: 'sunday_ot_end' },
    { header: 'Sunday OT Number', key: 'sunday_ot_num' },
    { header: 'Pallet Line Sunday', key: 'pallet_line_sunday' },
    { header: 'Hanging Line Sunday', key: 'hanging_line_sunday' }
  ]

  return (
    <div className="flex gap-2">
      <CSVDownloadButton
        data={data}
        columns={todayColumns}
        filename="overtime_today"
        buttonText="Today"
      />
      
      <CSVDownloadButton
        data={data}
        columns={tomorrowColumns}
        filename="overtime_tomorrow"
        buttonText="Tomorrow"
      />
      
      <CSVDownloadButton
        data={data}
        columns={sundayColumns}
        filename="overtime_sunday"
        buttonText="Sunday"
      />
    </div>
  )
}