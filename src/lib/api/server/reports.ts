import { api } from '@/lib/api/server/api'
import type { SPRReportRow } from '@/types/api'

export const getSPRReport = async (): Promise<SPRReportRow[]> => {
  const res = await api("/tasks/spr-report/")
  if (!res.ok) throw new Error(`Failed to fetch SPR report: ${res.status}`)
  return res.json()
}