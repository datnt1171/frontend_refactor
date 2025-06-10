import api from './client'

export const getProcesses = () => api.get("/processes/")

export const getProcessById = (id: string | number) => api.get(`/processes/${id}/`)