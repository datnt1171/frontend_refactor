'use client'

import { CSVDownloadButton, type ColumnConfig } from "@/components/ui/CSVDownloadButton"
import type { TransferAbsence } from "@/types"
import { formatDate } from "@/lib/utils/date"
import { daysDiff } from "@/lib/utils/date"

interface TransferAbsenceCSVButtonsProps {
  data: TransferAbsence[]
}

export function TransferAbsenceCSVButtons({ data }: TransferAbsenceCSVButtonsProps) {
  const Columns: ColumnConfig[] = [
    { header: 'From date', key: 'from_date', transform: (value) => formatDate(value) },
    { header: 'To date', key: 'to_date' },
    { header: 'User dept', key: 'department' },
    { header: 'Username', key: 'username' },
    { header: 'Full name', key: 'first_name', transform: (value, row) => `${row.last_name} ${row.first_name}` },
    { header: 'Onsite', key: 'factory_name_onsite' },
    { header: 'To Factory', key: 'factory_name' },
    { header: 'Num of Days', key: 'calculated_days', transform: (value, row) => daysDiff(row.from_date, row.to_date) + 1 }
  ]

  return (
    <div className="flex gap-2">
      <CSVDownloadButton
        data={data}
        columns={Columns}
        filename="transfer_absence"
        buttonText="Download"
      />
    </div>
  )
}