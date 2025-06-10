import api from './client'

export const getSPRReport = () => api.get("/tasks/spr-report/")