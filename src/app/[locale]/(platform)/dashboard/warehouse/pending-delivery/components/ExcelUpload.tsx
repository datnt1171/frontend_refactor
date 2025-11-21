'use client'

import { useState } from 'react'
import * as XLSX from 'xlsx'
import MonthlyLineChart from './charts/pendingByMonthChart'
import CustomerBarChart from './charts/pendingByFactoryChart'
import MonthCustomerStackedChart from './charts/pendingStackedChart'
import { useTranslations } from 'next-intl'
import { getMonthKey } from  '@/lib/utils/date'

interface ExcelRow {
  'Ngày ĐĐH': string
  'Mã số': string
  'Tên SP': string
  'QC': string
  'Mã kho': string
  'Ngày dự kiến giao hàng': string
  'Mã KH': string
  'KH Tên gọi tắt': string
  'SL đơn đặt': number
  'SL đã giao': number
  'SL chưa giao': number
  'ĐV': string
  'Mã ĐĐH': string
  'Mã ĐĐH của KH': string
  'Ghi chú': string
}

interface MonthlyData {
  month: string
  total: number
}

interface CustomerData {
  customer: string
  total: number
}

export default function ExcelDashboard() {
  const t = useTranslations()

  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [customerData, setCustomerData] = useState<CustomerData[]>([])
  const [stackedData, setStackedData] = useState<{
    months: string[]
    customers: string[]
    series: { name: string; data: number[] }[]
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)
    
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames?.[0]
        if (!firstSheetName) {
          throw new Error('No sheets found in workbook')
        }
        const worksheet = workbook.Sheets[firstSheetName]
        if (!worksheet) {
          throw new Error('Worksheet not found')
        }
        const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(worksheet)
        
        // Filter out row not include 'CHO BAO' or 'CHỜ BÁO'
        const filteredData = jsonData.filter(row => {
          const note = row['Ghi chú']?.toUpperCase() || ''
          return note.includes('CHO BAO') || note.includes('CHỜ BÁO')
        })
        // Process monthly data
        const monthly = processMonthlyData(filteredData)
        setMonthlyData(monthly)
        
        // Process customer data
        const customer = processCustomerData(filteredData)
        setCustomerData(customer)

         // Process stacked chart data
        const stacked = processMonthCustomerData(filteredData)
        setStackedData(stacked)
        
      } catch (err) {
        console.error('Error processing file:', err)
        setError('Failed to process file. Please check the format.')
      } finally {
        setLoading(false)
      }
    }
    
    reader.onerror = () => {
      setError('Failed to read file.')
      setLoading(false)
    }
    
    reader.readAsArrayBuffer(file)
  }

  const processMonthlyData = (data: ExcelRow[]): MonthlyData[] => {
  const monthlyMap = new Map<string, number>()
  
  data.forEach(row => {
    const month = getMonthKey(row['Ngày ĐĐH'])
    if (!month) return
    
    const qty = Number(row['SL chưa giao']) || 0
    monthlyMap.set(month, (monthlyMap.get(month) || 0) + qty)
  })
  
  return Array.from(monthlyMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, total]) => ({ month, total }))
}

  const processCustomerData = (data: ExcelRow[]): CustomerData[] => {
    const customerMap = new Map<string, number>()
    
    data.forEach(row => {
      const customer = row['KH Tên gọi tắt']
      if (!customer) return
      
      const qty = Number(row['SL chưa giao']) || 0
      customerMap.set(customer, (customerMap.get(customer) || 0) + qty)
    })
    
    // Sort by total ascending (smallest to largest)
    return Array.from(customerMap.entries())
      .sort((a, b) => a[1] - b[1]) // Changed from b[1] - a[1]
      .map(([customer, total]) => ({ customer, total }))
  }

  const processMonthCustomerData = (data: ExcelRow[]): {
  months: string[]
  customers: string[]
  series: { name: string; data: number[] }[]
} => {
  const monthCustomerMap = new Map<string, Map<string, number>>()
  const allCustomers = new Set<string>()
  
  data.forEach(row => {
    const month = getMonthKey(row['Ngày ĐĐH'])
    const customer = row['KH Tên gọi tắt']
    if (!month || !customer) return
    
    const qty = Number(row['SL chưa giao']) || 0
    
    if (!monthCustomerMap.has(month)) {
      monthCustomerMap.set(month, new Map())
    }
    
    const customerMap = monthCustomerMap.get(month)!
    customerMap.set(customer, (customerMap.get(customer) || 0) + qty)
    allCustomers.add(customer)
  })
  
  const months = Array.from(monthCustomerMap.keys()).sort()
  
  const customerTotals = new Map<string, number>()
  allCustomers.forEach(customer => {
    let total = 0
    months.forEach(month => {
      const customerMap = monthCustomerMap.get(month)
      total += customerMap?.get(customer) || 0
    })
    customerTotals.set(customer, total)
  })
  
  const customers = Array.from(allCustomers).sort((a, b) => {
    return (customerTotals.get(b) || 0) - (customerTotals.get(a) || 0)
  })
  
  const series = customers.map(customer => ({
    name: customer,
    data: months.map(month => {
      const customerMap = monthCustomerMap.get(month)
      return customerMap?.get(customer) || 0
    })
  }))
  
  return { months, customers, series }
}
  

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <label className="block mb-2 font-medium text-gray-700">
          Excel (.xlsx, .xls)
        </label>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          disabled={loading}
          className="block w-full text-sm text-gray-500 
                     file:mr-4 file:py-2 file:px-4
                     file:rounded file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100
                     disabled:opacity-50"
        />
        {loading && (
          <p className="mt-2 text-sm text-blue-600">{t('common.processing')}</p>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Charts Section */}
      {(monthlyData.length > 0 || customerData.length > 0) && (
        <div className='space-y-2'>
          
          {/* Bar Chart */}
          {customerData.length > 0 && (
            <div>
              <h3 className="text-center text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold break-words pb-2">
                订单等通知 ĐĐH CHỜ BÁO THEO TỪNG KHÁCH HÀNG
              </h3>
              <div className="bg-white shadow">
                <CustomerBarChart data={customerData} />
              </div>
            </div>
            
          )}

          {/* Line Chart */}
          {monthlyData.length > 0 && (
            <div>
              <h3 className="text-center text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold break-words pb-2">
                每月數量 ĐĐH chờ báo theo từng tháng
              </h3>
              <div className="bg-white shadow">
                <MonthlyLineChart data={monthlyData} />
              </div>
            </div>
          )}
          
          {/* Stacked Chart */}
          {stackedData && (
            <div>
              <h3 className="text-center text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold break-words pb-2">
                按月和客戶數量 ĐĐH chờ báo theo từng tháng và khách hàng
              </h3>
              <div className="bg-white shadow">
                <MonthCustomerStackedChart data={stackedData} />
              </div>
          </div>
        )}
        </div>
      )}

      {monthlyData.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          {t('common.noFileProvided')}
        </div>
      )}
    </div>
  )
}