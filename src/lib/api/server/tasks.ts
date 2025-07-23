import { api } from '@/lib/api/server/api'
import type { PaginatedSentTaskList, PaginatedReceivedTaskList, TaskDetail} from '@/types/api'

export const getSentTasks = async (): Promise<PaginatedSentTaskList> => {
  const res = await api("/tasks/sent/")
  if (!res.ok) throw new Error(`Failed to fetch sent tasks: ${res.status}`)
  return res.json()
}

export const getReceivedTasks = async (): Promise<PaginatedReceivedTaskList> => {
  const res = await api("/tasks/received/")
  if (!res.ok) throw new Error(`Failed to fetch received tasks: ${res.status}`)
  return res.json()
}

export const getTask = async (id: string): Promise<TaskDetail> => {
  const res = await api(`/tasks/${id}/`)
  if (!res.ok) throw new Error(`Failed to fetch task details: ${res.status}`)
  return res.json()
}