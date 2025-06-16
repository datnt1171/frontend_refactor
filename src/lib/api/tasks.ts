import api from './client'
import type { 
  ReceivedTask, 
  SentTask, 
  TaskDetail,
  TaskAction, 
  PaginatedSentTaskList, 
  PaginatedReceivedTaskList 
} from '@/types/api'

import type { AxiosResponse } from "axios";

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

export const createTask = (
  data: FormData
): Promise<AxiosResponse<TaskDetail>> =>
  api.post("/tasks/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const performTaskAction = async (
  id: string,
  actionData: TaskAction
) => {
  const hasFile = actionData.file instanceof File;

  if (hasFile) {
    const formData = new FormData();
    formData.append("action_id", actionData.action_id);
    if (actionData.comment) formData.append("comment", actionData.comment);
    formData.append("file", actionData.file as unknown as Blob);
    return api.post(`/tasks/${id}/actions/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } else {
    return api.post(`/tasks/${id}/actions/`, actionData);
  }
};