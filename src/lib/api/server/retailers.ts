import { api } from '@/lib/api/server/api'
import type { PaginatedRetailerList, RetailerDetail } from '@/types'

export const getRetailers = async (searchParams?: Record<string, string>): Promise<PaginatedRetailerList> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/crm/retailers?${queryString}` : '/crm/retailers'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch retailers: ${res.status}`)
  return res.json()
}

export const getRetailer = async (id: string): Promise<RetailerDetail> => {
  const res = await api(`/crm/retailers/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch retailers: ${res.status}`)
  return res.json()
}