import { api } from '@/lib/api/server/api'
import type { 
  PaginatedSentTaskList, 
  PaginatedReceivedTaskList, 
  TaskDetail, 
  TaskData
} from '@/types'

export const getSentTasks = async (searchParams?: Record<string, string>): Promise<PaginatedSentTaskList> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/tasks/sent?${queryString}` : '/tasks/sent'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch sent tasks: ${res.status}`)
  return res.json()
}

export const getReceivedTasks = async (searchParams?: Record<string, string>): Promise<PaginatedReceivedTaskList> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/tasks/received?${queryString}` : '/tasks/received'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch received tasks: ${res.status}`)
  return res.json()
}

export const getTask = async (id: string): Promise<TaskDetail> => {
  const res = await api(`/tasks/${id}/`)
  if (!res.ok) throw new Error(`Failed to fetch task details: ${res.status}`)
  return res.json()
}

export const getTaskData = async (taskId: string, fieldId: string): Promise<TaskData> => {
  const res = await api(`/tasks/${taskId}/data/${fieldId}`)
  if (!res.ok) throw new Error(`Failed to fetch task data: ${res.status}`)
  return res.json()
}