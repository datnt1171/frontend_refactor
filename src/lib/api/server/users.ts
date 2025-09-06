import { api } from '@/lib/api/server/api'
import type { UserDetail, PaginatedUserList, UserList } from '@/types/api'

export const getCurrentUser = async (): Promise<UserDetail> => {
  const res = await api("/users/me/")
  if (!res.ok) throw new Error(`Failed to fetch current user: ${res.status}`)
  return res.json()
}

export const getUsers = async (searchParams?: Record<string, string>): Promise<PaginatedUserList> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/users/?${queryString}` : '/users/'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`)
  return res.json()
}

export const getUser = async (id: string): Promise<UserList> => {
  const res = await api(`/users/${id}/`)
  if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`)
  return res.json()
}