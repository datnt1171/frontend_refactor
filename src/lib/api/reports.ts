import api from './client'
import type { AxiosResponse } from 'axios'
import type { SPRReportRow } from '@/types/api'

export const getSPRReport = (): Promise<AxiosResponse<SPRReportRow>> => 
    api.get("/tasks/spr-report/")