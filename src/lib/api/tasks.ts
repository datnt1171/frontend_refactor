import api from './client'

export const getSentTasks = () => api.get("/tasks/sent/")

export const getReceivedTasks = () => api.get("/tasks/received/")

export const getTaskById = (id: string | number) => api.get(`/tasks/${id}/`)

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