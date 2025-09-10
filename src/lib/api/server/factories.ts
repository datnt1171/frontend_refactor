import { api } from '@/lib/api/server/api'
import type {PaginatedFactoryList, FactoryDetail} from '@/types'

export const getFactories = async (searchParams?: Record<string, string>): Promise<PaginatedFactoryList> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/crm/factories?${queryString}` : '/crm/factories'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`)
  return res.json()
}

export const getFactory = async (id: string): Promise<FactoryDetail> => {
  const res = await api(`/crm/factories/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch factory: ${res.status}`)
  return res.json()
}