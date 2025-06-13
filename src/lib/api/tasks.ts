import api from './client'
import type { AxiosResponse } from 'axios'
import type { 
  SentTask, 
  ReceivedTask, 
  TaskDetail, 
  TaskCreate, 
  TaskAction 
} from '@/types/api'

export const getSentTasks = (): Promise<AxiosResponse<SentTask[]>> => 
  api.get("/tasks/sent/")

export const getReceivedTasks = (): Promise<AxiosResponse<ReceivedTask[]>> => 
  api.get("/tasks/received/")

export const getTaskById = (id: string): Promise<AxiosResponse<TaskDetail>> => 
  api.get(`/tasks/${id}/`)

export const createTask = (data: TaskCreate): Promise<AxiosResponse<TaskDetail>> =>
  api.post("/tasks/", data)

export const performTaskAction = (
  id: string,
  actionData: TaskAction,
  isFormData: boolean = false
): Promise<AxiosResponse<TaskDetail>> =>
  api.post(
    `/tasks/${id}/actions/`,
    actionData,
    isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
  )