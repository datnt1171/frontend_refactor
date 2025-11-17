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
import { useTranslations } from 'next-intl'

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

  const t = useTranslations()

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

    // Sort factories and months
    const sortedFactories = Array.from(selectedFactories).sort((a, b) => a - b)
    const sortedMonths = Array.from(selectedMonths).sort((a, b) => Number(a) - Number(b))
    
    // Build headers with translations
    const headerKeys = ['factory_code', 'factory_name']
    const headerLabels = [t('crm.factories.factoryId'), t('crm.factories.factoryName')]
    
    sortedMonths.forEach(month => {
      headerKeys.push(`${month}_thinner`, `${month}_paint`, `${month}_ratio`)
      headerLabels.push(
        `${month}_${t('product.thinner')}`,
        `${month}_${t('product.paint')}`,
        `${month}_${t('product.ratio')}`
      )
    })

    // Build rows
    const csvRows = sortedFactories.map(factoryIdx => {
      const row: any = {
        factory_code: ratioData[factoryIdx]!.factory_code,
        factory_name: ratioData[factoryIdx]!.factory_name
      }
      
      sortedMonths.forEach(month => {
        row[`${month}_thinner`] = thinnerData[factoryIdx]![month] ?? 0
        row[`${month}_paint`] = paintData[factoryIdx]![month] ?? 0
        // Prefix ratio with single quote to prevent Excel from converting to time
        const ratioValue = ratioData[factoryIdx]![month] ?? 0
        row[`${month}_ratio`] = ratioValue === 0 || ratioValue === '0' ? 0 : `'${ratioValue}`
      })
      
      return row
    })

    // Create CSV content using translated headers
    const csvContent = [
      headerLabels.join(','),
      ...csvRows.map(row => 
        headerKeys.map(key => {
          const value = row[key]
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

  const downloadAllRatioCSV = () => {
    // Create columns config
    const columns = [
      { key: 'factory_code', header: t('crm.factories.factoryId') },
      { key: 'factory_name', header: t('crm.factories.factoryName') },
      ...monthColumns.map(month => ({
        key: month,
        header: `${month}`
      }))
    ]

    // Extract headers
    const headers = columns.map(col => col.header)

    // Transform data
    const csvData = ratioData.map(row => 
      columns.map(col => row[col.key])
    )

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        row.map(field => 
          typeof field === 'string' && (field.includes(',') || field.includes('"')) 
            ? `"${field.replace(/"/g, '""')}"` 
            : field
        ).join(',')
      )
    ].join('\n')

    // Download file
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', 'ratio-all.csv')
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
        <h3 className="font-semibold">{t('product.ratio')}</h3>
        <Button 
          onClick={downloadSelectedCSV}
          variant="outline"
          size="sm"
          disabled={selectedFactories.size === 0 || selectedMonths.size === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          {t('common.downloadSelected')}
          
        </Button>

        <Button 
          onClick={downloadAllRatioCSV}
          variant="outline"
          size="sm"
        >
          <Download className="w-4 h-4 mr-2" />
          {t('common.download')}
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
            <TableHead>{t('crm.factories.factoryId')}</TableHead>
            <TableHead>{t('crm.factories.factoryName')}</TableHead>
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