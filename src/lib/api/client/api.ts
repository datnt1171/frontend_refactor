// lib/api-client.ts
import type { 
  LoginRequest, 
  LoginSuccessResponse, 
  LoginErrorResponse,
  ApiSuccessResponse,
  TaskAction,
  SetPasswordRetype
} from '@/types/'

type ApiResponse<T> = {
  data: T
  status: number
  ok: boolean
}

// Generic API helper
const refreshTokens = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    })
    
    return response.ok
  } catch (error) {
    console.error('Token refresh failed:', error)
    return false
  }
}

const apiClient = async <T = any>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  // First attempt
  console.log('first client attempt')
  let response = await fetch(`/api${endpoint}`, {
    headers: {
      ...options.headers,
    },
    ...options,
  })

  // If unauthorized, try to refresh token
  if (response.status === 401) {
    const refreshSuccess = await refreshTokens()
    
    if (refreshSuccess) {
      // Retry the original request with new tokens
      response = await fetch(`/api${endpoint}`, {
        headers: {
          ...options.headers,
        },
        ...options,
      })
    }
  }

  const data = await response.json()
  
  return {
    data,
    status: response.status,
    ok: response.ok
  }
}

// Auth functions
export const login = async (credentials: LoginRequest) => {
  const response = await apiClient<LoginSuccessResponse | LoginErrorResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  return response
}

export const logout = async () => {
  const response = await apiClient<ApiSuccessResponse>('/auth/logout', {
    method: 'POST',
  })
  return response
}

// Task functions
export async function createTask(formData: FormData) {
  try {
    const response = await apiClient('/tasks/', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      return { success: false, error: response.data.message || 'Failed to create task' }
    }
    
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: 'Network error' }
  }
}

export const performTaskAction = async (
  id: string,
  actionData: TaskAction
) => {
  const hasFile = actionData.file instanceof File

  if (hasFile && actionData.file) {
    const formData = new FormData()
    formData.append("action_id", actionData.action_id)
    if (actionData.comment) formData.append("comment", actionData.comment)
    formData.append("file", actionData.file)

    const response = await apiClient(`/tasks/${id}/actions/`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(response.data.error || `Failed to perform action: ${response.status}`)
    }

    return response.data
  } else {
    const response = await apiClient(`/tasks/${id}/actions/`, {
      method: 'POST',
      body: JSON.stringify(actionData),
    })

    if (!response.ok) {
      throw new Error(response.data.error || `Failed to perform action: ${response.status}`)
    }

    return response.data
  }
}

// User functions
export const changePassword = async (data: SetPasswordRetype) => {
  const response = await apiClient<SetPasswordRetype>('/users/me/change-password', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return response
}