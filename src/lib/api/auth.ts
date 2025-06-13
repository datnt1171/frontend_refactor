import api from './client'
import type { LoginRequest, RefreshResponse } from '@/types/backend/auth'
import type { ApiSuccessResponse } from '@/types/common'

export const login = (credentials: LoginRequest) =>
  api.post<ApiSuccessResponse>("/auth/login", credentials)

export const refreshToken = () => api.get<RefreshResponse>("/auth/refresh")

export const logout = () => api.post("/auth/logout")