import api from './client'
import type { UserDetail, UserList, SetPasswordRetype } from '@/types/api'

export const getCurrentUser = () => api.get<UserDetail>("/users/me")

export const getUsers = () => api.get<UserList[]>("/users/")

export const changePassword = (data: SetPasswordRetype) => 
  api.post<SetPasswordRetype>("/users/set_password", data)
