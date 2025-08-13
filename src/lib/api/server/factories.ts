import { api } from '@/lib/api/server/api'
import type {PaginatedFactoryList, FactoryDetail} from '@/types'

export const getFactories = async (params?: {
  is_active?: boolean
  has_onsite?: boolean
  offset?: number
  limit?: number
}): Promise<PaginatedFactoryList> => {
  const searchParams = new URLSearchParams()
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })
  }
  
  const queryString = searchParams.toString()
  const endpoint = `/crm/factories${queryString ? `?${queryString}` : ''}`
  
  const res = await api(endpoint)
  if (!res.ok) {
    throw new Error(`Failed to fetch factories: ${res.status} ${res.statusText}`)
  }
  
  return res.json()
}

export const getFactory = async (id: string): Promise<FactoryDetail> => {
  const res = await api(`/crm/factories/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch factory: ${res.status}`)
  return res.json()
}