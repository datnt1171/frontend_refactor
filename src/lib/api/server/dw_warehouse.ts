import { api } from '@/lib/api/server/api'
import type { 
    Overall,
    FactorySalesRangeDiff,
    FactoryOrderRangeDiff,
    ProductSalesRangeDiff,
    ProductOrderRangeDiff,
    ScheduledAndActualSales,
    // SalesOverTime,
    IsSameMonth,
    SalesOrderPctDiff,
    PivotThinnerPaintRatio,
} from '@/types'

export const getWarehouseOverall = async (searchParams?: Record<string, string>): Promise<Overall[]> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/warehouse/overall?${queryString}` : '/warehouse/overall'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch Warehouse overall: ${res.status}`)
  return res.json()
}


export const getFactorySalesRangeDiff = async (searchParams?: Record<string, string>): Promise<FactorySalesRangeDiff[]> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/warehouse/factory-sales-range-diff?${queryString}` : '/warehouse/factory-sales-range-diff'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch Warehouse FactorySalesRangeDiff: ${res.status}`)
  return res.json()
}


export const getFactoryOrderRangeDiff = async (searchParams?: Record<string, string>): Promise<FactoryOrderRangeDiff[]> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/warehouse/factory-order-range-diff?${queryString}` : '/warehouse/factory-order-range-diff'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch Warehouse FactoryOrderRangeDiff: ${res.status}`)
  return res.json()
}


export const getProductSalesRangeDiff = async (searchParams?: Record<string, string>): Promise<ProductSalesRangeDiff[]> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/warehouse/product-sales-range-diff?${queryString}` : '/warehouse/product-sales-range-diff'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch Warehouse ProductSalesRangeDiff: ${res.status}`)
  return res.json()
}


export const getProductOrderRangeDiff = async (searchParams?: Record<string, string>): Promise<ProductOrderRangeDiff[]> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/warehouse/product-order-range-diff?${queryString}` : '/warehouse/product-order-range-diff'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch Warehouse ProductOrderRangeDiff: ${res.status}`)
  return res.json()
}


export const getScheduledAndActualSales = async (searchParams?: Record<string, string>): Promise<ScheduledAndActualSales[]> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/warehouse/scheduled-and-actual-sales?${queryString}` : '/warehouse/scheduled-and-actual-sales'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch Warehouse ScheduledAndActualSales: ${res.status}`)
  return res.json()
}


export const getSalesOvertime = async (searchParams?: Record<string, string>) => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/warehouse/sales-overtime?${queryString}` : '/warehouse/sales-overtime'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch Warehouse SalesOvertime: ${res.status}`)
  return res.json()
}


export const getIsSameMonth = async (searchParams?: Record<string, string>): Promise<IsSameMonth[]> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/warehouse/is-same-month?${queryString}` : '/warehouse/is-same-month'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch Warehouse IsSameMonth: ${res.status}`)
  return res.json()
}


export const getSalesOrderPctDiff = async (searchParams?: Record<string, string>): Promise<SalesOrderPctDiff> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/warehouse/sales-order-pct-diff?${queryString}` : '/warehouse/sales-order-pct-diff'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch Warehouse SalesOrderPctDiff: ${res.status}`)
  return res.json()
}


export const getThinnerPaintRatio = async (searchParams?: Record<string, string>): Promise<PivotThinnerPaintRatio> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/warehouse/thinner-paint-ratio?${queryString}` : '/warehouse/thinner-paint-ratio'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch Warehouse ThinnerPaintRatio: ${res.status}`)
  return res.json()
}