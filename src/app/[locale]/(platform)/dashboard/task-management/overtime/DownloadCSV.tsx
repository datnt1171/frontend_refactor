'use client'

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface DownloadCSVButtonsProps {
  data: {
    name_of_customer: string;
    weekday_ot: string;
    weekday_ot_start: string;
    weekday_ot_end: string;
    weekday_ot_num: number;
    hanging_line_today: string;
    pallet_line_today: string;
    others_today: string;
    hanging_line_tomorrow: string;
    pallet_line_tomorrow: string;
    others_tomorrow: string;
    instock: string;
    instock_by_code: string;
    sunday_ot: string;
    sunday_ot_end: string;
    sunday_ot_num: number;
    hanging_line_sunday: string;
    pallet_line_sunday: string;
    created_at: string;
    factory_name: string;
  }[]
}

export function DownloadCSVButtons({ data }: DownloadCSVButtonsProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }

  const addDayToDate = (dateString: string): string => {
    const date = new Date(dateString)
    date.setDate(date.getDate() + 1)
    return formatDate(date.toISOString())
  }

  const downloadCSV = (csvData: any[][], headers: string[], filename: string) => {
    if (!data || data.length === 0) return

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        row.map(field => 
          // Escape fields that contain commas or quotes
          typeof field === 'string' && (field.includes(',') || field.includes('"')) 
            ? `"${field.replace(/"/g, '""')}"` 
            : field
        ).join(',')
      )
    ].join('\n')

    // Add UTF-8 BOM for Excel compatibility
    const BOM = '\uFEFF'
    const csvWithBOM = BOM + csvContent

    // Create and download file
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const downloadTodayData = () => {
    const headers = [
      'Created At',
      'Factory Code', 
      'Factory Name',
      'OT Start',
      'OT End',
      'OT Number',
      'Pallet Line Today',
      'Hanging Line Today',
      'Others Today',
      'In Stock',
      'In Stock by Code'
    ]

    const csvData = data.map(row => [
      formatDate(row.created_at),
      row.name_of_customer,
      row.factory_name,
      row.weekday_ot_start,
      row.weekday_ot_end,
      row.weekday_ot_num,
      row.pallet_line_today,
      row.hanging_line_today,
      row.others_today,
      row.instock,
      row.instock_by_code
    ])

    downloadCSV(csvData, headers, 'overtime_today')
  }

  const downloadTomorrowData = () => {
    const headers = [
      'Tomorrow Date',
      'Factory Code',
      'Factory Name', 
      'Hanging Line Tomorrow',
      'Pallet Line Tomorrow',
      'Others Tomorrow'
    ]

    const csvData = data.map(row => [
      addDayToDate(row.created_at),
      row.name_of_customer,
      row.factory_name,
      row.hanging_line_tomorrow,
      row.pallet_line_tomorrow,
      row.others_tomorrow
    ])

    downloadCSV(csvData, headers, 'overtime_tomorrow')
  }

  const downloadSundayData = () => {
    const headers = [
      'Created At',
      'Factory Code',
      'Factory Name',
      'Sunday OT',
      'Sunday OT End',
      'Sunday OT Number',
      'Hanging Line Sunday',
      'Pallet Line Sunday'
    ]

    const csvData = data.map(row => [
      formatDate(row.created_at),
      row.name_of_customer,
      row.factory_name,
      row.sunday_ot,
      row.sunday_ot_end,
      row.sunday_ot_num,
      row.hanging_line_sunday,
      row.pallet_line_sunday
    ])

    downloadCSV(csvData, headers, 'overtime_sunday')
  }

  const isDisabled = !data || data.length === 0

  return (
    <div className="flex gap-2">
      <Button 
        onClick={downloadTodayData}
        variant="outline"
        size="sm"
        disabled={isDisabled}
      >
        <Download className="w-4 h-4 mr-2" />
        Today
      </Button>
      
      <Button 
        onClick={downloadTomorrowData}
        variant="outline"
        size="sm"
        disabled={isDisabled}
      >
        <Download className="w-4 h-4 mr-2" />
        Tomorrow
      </Button>
      
      <Button 
        onClick={downloadSundayData}
        variant="outline"
        size="sm"
        disabled={isDisabled}
      >
        <Download className="w-4 h-4 mr-2" />
        Sunday
      </Button>
    </div>
  )
}