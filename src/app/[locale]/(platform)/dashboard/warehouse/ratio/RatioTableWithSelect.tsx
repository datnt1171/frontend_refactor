'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ThinnerPaintRatioData {
  thinner_data: {
    [key: string]: unknown
  }[]
  paint_data: {
    [key: string]: unknown
  }[]
  ratio_data: {
    [key: string]: unknown
  }[]
}

interface RatioTableWithSelectProps {
  data: ThinnerPaintRatioData
  monthColumns: string[]
}

export function RatioTableWithSelect({
  data,
  monthColumns
}: RatioTableWithSelectProps) {
  const { thinner_data: thinnerData, paint_data: paintData, ratio_data: ratioData } = data
  const [selectedFactories, setSelectedFactories] = useState<Set<number>>(new Set())
  const [selectedMonths, setSelectedMonths] = useState<Set<string>>(new Set())

  const toggleFactory = (index: number) => {
    const newSet = new Set(selectedFactories)
    if (newSet.has(index)) {
      newSet.delete(index)
    } else {
      newSet.add(index)
    }
    setSelectedFactories(newSet)
  }

  const toggleMonth = (month: string) => {
    const newSet = new Set(selectedMonths)
    if (newSet.has(month)) {
      newSet.delete(month)
    } else {
      newSet.add(month)
    }
    setSelectedMonths(newSet)
  }

  const toggleAllFactories = () => {
    if (selectedFactories.size === ratioData.length) {
      setSelectedFactories(new Set())
    } else {
      setSelectedFactories(new Set(ratioData.map((_, idx) => idx)))
    }
  }

  const toggleAllMonths = () => {
    if (selectedMonths.size === monthColumns.length) {
      setSelectedMonths(new Set())
    } else {
      setSelectedMonths(new Set(monthColumns))
    }
  }

  const downloadSelectedCSV = () => {
    if (selectedFactories.size === 0 || selectedMonths.size === 0) {
      alert('Please select at least one factory and one month')
      return
    }

    // Build CSV data
    const csvRows: any[] = []
    
    // Sort factories and months
    const sortedFactories = Array.from(selectedFactories).sort((a, b) => a - b)
    const sortedMonths = Array.from(selectedMonths).sort((a, b) => Number(a) - Number(b))
    
    sortedFactories.forEach(factoryIdx => {
      sortedMonths.forEach(month => {
        csvRows.push({
          factory_code: ratioData[factoryIdx]!.factory_code,
          factory_name: ratioData[factoryIdx]!.factory_name,
          month: month,
          thinner: thinnerData[factoryIdx]![month] ?? 0,
          paint: paintData[factoryIdx]![month] ?? 0,
          ratio: ratioData[factoryIdx]![month] ?? 0
        })
      })
    })

    // Create CSV content
    const headers = ['factory_code', 'factory_name', 'month', 'thinner', 'paint', 'ratio']
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => 
        headers.map(header => {
          const value = row[header]
          return typeof value === 'string' && (value.includes(',') || value.includes('"'))
            ? `"${value.replace(/"/g, '""')}"`
            : value
        }).join(',')
      )
    ].join('\n')

    // Download file
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', 'ratio-selected.csv')
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  const allFactoriesSelected = selectedFactories.size === ratioData.length && ratioData.length > 0
  const allMonthsSelected = selectedMonths.size === monthColumns.length && monthColumns.length > 0

  return (
    <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
      <div className="flex items-center justify-between px-4 py-2">
        <h3 className="font-semibold">Ratio Data</h3>
        <Button 
          onClick={downloadSelectedCSV}
          variant="outline"
          size="sm"
          disabled={selectedFactories.size === 0 || selectedMonths.size === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Download Selected
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allFactoriesSelected}
                onCheckedChange={toggleAllFactories}
              />
            </TableHead>
            <TableHead>Factory Code</TableHead>
            <TableHead>Factory Name</TableHead>
            {monthColumns.map(month => (
              <TableHead key={month} className="text-center">
                <div className="flex flex-col items-center gap-1">
                  <span>{month}</span>
                  <Checkbox
                    checked={selectedMonths.has(month)}
                    onCheckedChange={() => toggleMonth(month)}
                  />
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {ratioData.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <Checkbox
                  checked={selectedFactories.has(idx)}
                  onCheckedChange={() => toggleFactory(idx)}
                />
              </TableCell>
              <TableCell>{String(row.factory_code ?? '')}</TableCell>
              <TableCell>{String(row.factory_name ?? '')}</TableCell>
              {monthColumns.map(month => (
                <TableCell key={month} className="text-center">
                  {String(row[month] ?? 0)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}