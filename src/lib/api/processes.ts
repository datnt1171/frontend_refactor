import api from './client'

import type { PaginatedProcessListList, ProcessDetail } from '@/types/api';

export const getProcesses = async (): Promise<PaginatedProcessListList> => {
  const res = await api.get<PaginatedProcessListList>("/processes/");
  return res.data;
};

export const getProcessById = async (id: string): Promise<ProcessDetail> => {
  const res = await api.get<ProcessDetail>(`/processes/${id}/`);
  return res.data;
};