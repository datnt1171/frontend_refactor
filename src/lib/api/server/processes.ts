import { api } from '@/lib/api/server/api'
import type { PaginatedProcessListList, ProcessDetail } from '@/types/api'

export const getProcesses = async (): Promise<PaginatedProcessListList> => {
  const res = await api("/processes/")
  if (!res.ok) throw new Error(`Failed to fetch processes: ${res.status}`)
  return res.json()
}

export const getProcess = async (id: string): Promise<ProcessDetail> => {
  const res = await api(`/processes/${id}/`)
  if (!res.ok) throw new Error(`Failed to fetch process: ${res.status}`)
  return res.json()
}