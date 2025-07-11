'use server'
import { api } from '@/lib/api/server/api'
import type { PaginatedSentTaskList, PaginatedReceivedTaskList, TaskDetail, TaskAction} from '@/types/api'

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
    return { success: true, data }
  } catch (error) {
    return { success: false, error: 'Network error' }
  }
}

export const performTaskAction = async (
  id: string,
  actionData: TaskAction
) => {
  const hasFile = actionData.file instanceof File;

  if (hasFile && actionData.file) {
    const formData = new FormData();
    formData.append("action_id", actionData.action_id);
    if (actionData.comment) formData.append("comment", actionData.comment);
    formData.append("file", actionData.file);

    const res = await api(`/tasks/${id}/actions/`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || `Failed to perform action: ${res.status}`);
    }

    return res.json();
  } else {
    const res = await api(`/tasks/${id}/actions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(actionData),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || `Failed to perform action: ${res.status}`);
    }

    return res.json();
  }
};