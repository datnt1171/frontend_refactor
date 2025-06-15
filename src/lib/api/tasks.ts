import api from './client'
import type { 
  ReceivedTask, 
  SentTask, 
  TaskDetail,
  TaskCreate, 
  TaskAction, 
  PaginatedSentTaskList, 
  PaginatedReceivedTaskList 
} from '@/types/api'

export const getSentTasks = async (): Promise<SentTask[]> => {
  const res = await api.get<PaginatedSentTaskList>("/tasks/sent/")
  return res.data.results
}
  

export const getReceivedTasks = async (): Promise<ReceivedTask[]> => {
  const res = await api.get<PaginatedReceivedTaskList>("tasks/received")
  return res.data.results
}

export const getTaskById = async (id: string): Promise<TaskDetail> => {
  const res = await api.get<TaskDetail>(`/tasks/${id}/`)
  return res.data
}

export const createTask = (data: any) =>
  api.post("/tasks/", data)

export const performTaskAction = (
  id: string | number,
  actionData: any,
  isFormData: boolean = false
) =>
  api.post(
    `/tasks/${id}/actions/`,
    actionData,
    isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
  )