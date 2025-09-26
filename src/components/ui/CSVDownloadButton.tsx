'use client'

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import type { ColumnConfig } from '@/types'


interface CSVDownloadButtonProps {
  data: any[]
  columns: ColumnConfig[]
  filename: string
  buttonText?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}


export function CSVDownloadButton({ 
  data, 
  columns, 
  filename, 
  buttonText = "Download CSV",
  variant = "outline",
  size = "sm",
  className = ""
}: CSVDownloadButtonProps) {

  const downloadCSV = () => {
    if (!data || data.length === 0) return

    // Extract headers
    const headers = columns.map(col => col.header)

    // Transform data based on column configuration
    const csvData = data.map(row => 
      columns.map(col => {
        const value = row[col.key]
        return col.transform ? col.transform(value, row) : value
      })
    )

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

  const isDisabled = !data || data.length === 0

  return (
    <Button 
      onClick={downloadCSV}
      variant={variant}
      size={size}
      disabled={isDisabled}
      className={className}
    >
      <Download className="w-4 h-4 mr-2" />
      {buttonText}
    </Button>
  )
}

export type { ColumnConfig, CSVDownloadButtonProps }