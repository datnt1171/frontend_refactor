import { api } from '@/lib/api/server/api'
import type { 
    Overall,
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