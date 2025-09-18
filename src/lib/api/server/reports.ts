import { api } from '@/lib/api/server/api'
import type { TaskDataDetail, TaskActionDetail } from '@/types/api'

export const getDataDetail = async (searchParams?: Record<string, string>): Promise<TaskDataDetail[]> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/tasks/data-detail?${queryString}` : '/tasks/data-detail'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch task data detail: ${res.status}`)
  return res.json()
}

export const getActionDetail = async (searchParams?: Record<string, string>): Promise<TaskActionDetail[]> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/tasks/action-detail?${queryString}` : '/tasks/action-detail'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch task action detail: ${res.status}`)
  return res.json()
}