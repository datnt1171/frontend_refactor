import api from './client'
import type { UserDetail, PaginatedUserList, SetPasswordRetype, UserList } from '@/types/api'

export const getCurrentUser = () => api.get<UserDetail>("/users/me")

export const getUsers = async (): Promise<PaginatedUserList> => {
  const res = await api.get<PaginatedUserList>("/users/")
  return res.data;
}

export const changePassword = (data: SetPasswordRetype) => 
  api.patch<SetPasswordRetype>("/users/me/change-password", data)

export const getUser = async (id: string): Promise<UserList> => {
  const res = await api.get<UserList>(`/users/${id}/`);
  return res.data;
};
