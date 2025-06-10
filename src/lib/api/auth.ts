import api from './client'

export const login = (credentials: { username: string; password: string }) =>
  api.post("/auth/login", credentials)

export const refreshToken = () => api.get("/auth/refresh")

export const logout = () => api.post("/auth/logout")