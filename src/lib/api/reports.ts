import api from './client'
import type { SPRReportRow } from '@/types/api'

export const getSPRReport = async (): Promise<SPRReportRow[]> => {
  const res = await api.get<SPRReportRow[]>("/tasks/spr-report/")
  return res.data
}