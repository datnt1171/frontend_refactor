import type { LoginRequest, LoginSuccessResponse, LoginErrorResponse } from '@/types/auth'

export async function login(credentials: LoginRequest): Promise<{ data: LoginSuccessResponse | LoginErrorResponse }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()
    return { data }
  } catch (error) {
    // Network error fallback
    throw error
  }
}

export async function logout(): Promise<void> {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Logout failed')
    }
  } catch (error) {
    console.error('Logout error:', error)
    // Don't throw - we want to clear user state even if server call fails
  }
}

import type { UserDetail } from '@/types/api'

export async function getCurrentUser(): Promise<UserDetail> {
  const response = await fetch('/api/users/me', {
    credentials: 'include'
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }
  
  return response.json()
}