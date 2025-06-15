import api from './client'

export const getProcesses = () => api.get("/processes/")

export const getProcessById = (id: string) => api.get(`/processes/${id}/`)