import { api } from '@/lib/api/server/api'
import { revalidatePath } from 'next/cache'
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

export async function createTask(formData: FormData): Promise<{ success: boolean; data?: TaskDetail; error?: string }> {
  try {
    const res = await api("/tasks/", {
      method: 'POST',
      body: formData,
    })
    
    if (!res.ok) {
      const errorData = await res.json()
      return { success: false, error: errorData.message || 'Failed to create task' }
    }
    
    const data: TaskDetail = await res.json()
    revalidatePath('/tasks')
    return { success: true, data }
  } catch (error) {
    return { success: false, error: 'Network error' }
  }
}

export async function performTaskAction(
  id: string, 
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await api(`/tasks/${id}/actions/`, {
      method: 'POST',
      body: formData,
    })
    
    if (!res.ok) {
      const errorData = await res.json()
      return { success: false, error: errorData.message || 'Failed to perform action' }
    }
    
    revalidatePath(`/tasks/${id}`)
    revalidatePath('/tasks')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Network error' }
  }
}