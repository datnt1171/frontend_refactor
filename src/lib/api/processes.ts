import api from './client'
import type { AxiosResponse } from 'axios'
import type { ProcessList, ProcessDetail } from '@/types/api' //

export const getProcesses = (): Promise<AxiosResponse<ProcessList[]>> => 
  api.get("/processes/")

export const getProcessById = (id: string): Promise<AxiosResponse<ProcessDetail>> => 
  api.get(`/processes/${id}/`)