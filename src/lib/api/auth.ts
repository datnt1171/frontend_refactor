import api from './client'
import type { LoginRequest, LoginResponse } from '@/types/auth'
import type { ApiSuccessResponse } from "@/types/common"

export const login = (credentials: LoginRequest) =>
  api.post<LoginResponse>("/auth/login", credentials)

export const refreshToken = ()  => 
  api.get<LoginResponse>("/auth/refresh")

export const logout = () => 
  api.post<ApiSuccessResponse>("/auth/logout")