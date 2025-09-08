import { api } from '@/lib/api/server/api'
import type { PaginatedProcessListList, ProcessDetail } from '@/types/api'

export const getProcesses = async (searchParams?: Record<string, string>): Promise<PaginatedProcessListList> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/processes/?${queryString}` : '/processes/'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch processes: ${res.status}`)
  return res.json()
}

export const getProcess = async (id: string): Promise<ProcessDetail> => {
  const res = await api(`/processes/${id}/`)
  if (!res.ok) throw new Error(`Failed to fetch process: ${res.status}`)
  return res.json()
}