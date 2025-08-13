import { api } from '@/lib/api/server/api'
import type { PaginatedRetailerList, RetailerDetail } from '@/types'

export const getRetailers = async (params?: {
  offset?: number
  limit?: number
}): Promise<PaginatedRetailerList> => {
  const searchParams = new URLSearchParams()
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })
  }
  
  const queryString = searchParams.toString()
  const endpoint = `/crm/retailers${queryString ? `?${queryString}` : ''}`
  
  const res = await api(endpoint)
  if (!res.ok) {
    throw new Error(`Failed to fetch retailers: ${res.status} ${res.statusText}`)
  }
  
  return res.json()
}

export const getRetailer = async (id: string): Promise<RetailerDetail> => {
  const res = await api(`/crm/retailers/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch retailers: ${res.status}`)
  return res.json()
}