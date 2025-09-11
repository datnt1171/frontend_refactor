import { api } from '@/lib/api/server/api'
import type { SPRReportRow, TaskDataDetail, TaskActionDetail } from '@/types/api'

export const getSPRReport = async (): Promise<SPRReportRow[]> => {
  const res = await api("/tasks/spr-report/")
  if (!res.ok) throw new Error(`Failed to fetch SPR report: ${res.status}`)
  return res.json()
}

export const getDataDetail = async (): Promise<TaskDataDetail[]> => {
  const res = await api("/tasks/data-detail/")
  if (!res.ok) throw new Error(`Failed to fetch task data detail: ${res.status}`)
  return res.json()
}

export const getActionDetail = async (): Promise<TaskActionDetail[]> => {
  const res = await api("/tasks/action-detail/")
  if (!res.ok) throw new Error(`Failed to fetch task action detail: ${res.status}`)
  return res.json()
}