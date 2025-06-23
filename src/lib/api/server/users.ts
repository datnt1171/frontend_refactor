import { api } from '@/lib/api/server/api'
import type { UserDetail, PaginatedUserList, UserList, SetPasswordRetype } from '@/types/api'

export const getCurrentUser = async (): Promise<UserDetail> => {
  const res = await api("/users/me/")
  if (!res.ok) throw new Error(`Failed to fetch current user: ${res.status}`)
  return res.json()
}

export const getUsers = async (): Promise<PaginatedUserList> => {
  const res = await api("/users/")
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`)
  return res.json()
}

export const getUser = async (id: string): Promise<UserList> => {
  const res = await api(`/users/${id}/`)
  if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`)
  return res.json()
}

export async function changePassword(
  data: SetPasswordRetype
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await api("/users/set_password/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!res.ok) {
      const errorData = await res.json()
      return { success: false, error: errorData.message || 'Failed to change password' }
    }
    
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Network error' }
  }
}