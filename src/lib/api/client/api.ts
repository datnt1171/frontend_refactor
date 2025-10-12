import type { 
  LoginRequest, 
  ApiSuccessResponse,
  TaskAction,
  SetPasswordRetype,
  FactoryUpdate,
  BlueprintCreate,
  BlueprintUpdate,
  FinishingSheet,
  UserFactoryOnsite,
  SheetBlueprint
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

  let data = null
  const contentType = response.headers.get('content-type')
  
  if (contentType && contentType.includes('application/json')) {
    const text = await response.text()
    if (text.trim()) {
      data = JSON.parse(text)
    }
  }
  
  return {
    data,
    status: response.status,
    ok: response.ok
  }
}

// Auth functions
export const login = async (credentials: LoginRequest) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
  const data = await response.json()
  return {
    data,
    status: response.status,
    ok: response.ok
  }
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


export async function uploadTaskFilesInBackground(
  taskId: string,
  fileFields: Array<{fieldId: string, files: File[]}>
) {
  try {
    for (const {fieldId, files} of fileFields) {
      try {
        const formData = new FormData()
        formData.append('field_id', fieldId)
        
        files.forEach(file => {
          formData.append('files', file)
        })

        const response = await apiClient(`/tasks/${taskId}/upload-files`, {
          method: 'POST',
          body: formData,
        })
        
        if (!response.ok) {
          console.error(`[API CLIENT] Upload failed for field ${fieldId}:`, response.data?.message)
        }
      } catch (error) {
        console.error(`[API CLIENT] Upload error for field ${fieldId}:`, error)
      }
    }
  } catch (error) {
    console.error('[API CLIENT] Background file upload failed:', error)
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
  const response = await apiClient('/users/me/change-password', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  return response
}

export const updateTaskData = async (
  taskId: string, 
  fieldId: string, 
  data: FormData | Record<string, any>
) => {
  const isFormData = data instanceof FormData
  
  const response = await apiClient(`/tasks/${taskId}/data/${fieldId}`, {
    method: 'PATCH',
    body: isFormData ? data : JSON.stringify(data),
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Failed to update task data: ${response.status}`)
  }

  return response.data
}

// Factory
export const updateFactory = async (
  id: string, 
  data: FactoryUpdate
) => {
  const response = await apiClient(`/crm/factories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`Failed to update factory data: ${response.status}`)
  }

  return response.data
}


export async function createBlueprint(id: string, blueprintData: BlueprintCreate) {
    const formData = new FormData()
    formData.append('factory', blueprintData.factory)
    formData.append('name', blueprintData.name)
    formData.append('type', blueprintData.type)
    if (blueprintData.description) {
      formData.append('description', blueprintData.description)
    }
    formData.append('file', blueprintData.file)

    const response = await apiClient(`/crm/factories/${id}/blueprints`, {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error(`Failed to update factory data: ${response.status}`)
    }

    return response.data
}

export async function updateBlueprint(id: string, blueprint_id: string, blueprintData: BlueprintUpdate) {
    const response = await apiClient(`/crm/factories/${id}/blueprints/${blueprint_id}`, {
      method: 'PUT',
      body: JSON.stringify(blueprintData),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to update factory data: ${response.status}`)
    }

    return response.data
}

export async function deleteBlueprint(id: string, blueprint_id: string) {
    const response = await apiClient(`/crm/factories/${id}/blueprints/${blueprint_id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error(`Failed to update factory data: ${response.status}`)
    }

    return response.data
}


export const createFinishingSheet = async (
  taskId: string, 
  data: FinishingSheet
) => {
  const response = await apiClient(`/tasks/${taskId}/sheets`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
      throw new Error(`Failed to update factory data: ${response.status}`)
    }

    return response.data
}

// Update a finishing sheet
export const putFinishingSheet = async (
  taskId: string, 
  sheetId: string, 
  data: FinishingSheet
) => {
  const response = await apiClient(`/tasks/${taskId}/sheets/${sheetId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
      throw new Error(`Failed to update factory data: ${response.status}`)
    }

    return response.data
}

// Delete a finishing sheet
export const deleteFinishingSheet = async (taskId: string, sheetId: string) => {
const response = await apiClient(`/tasks/${taskId}/sheets/${sheetId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error(`Failed to delete Finishing sheet: ${response.status}`)
    }

    return response.data
}

export const CreateUpdateOnsite = async (data: UserFactoryOnsite[]) => {
  const response = await apiClient(`/users/onsite/bulk_update`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
      throw new Error(`Failed to create or update User factory onsite: ${response.status}`)
    }

    return response.data
}

export const createSheetBlueprint = async (
  TaskId: string, 
  SheetId: string, 
  data: Pick<SheetBlueprint, 'finishing_sheet' | 'blueprint' | 'description'>
) => {
  const response = await apiClient(`/tasks/${TaskId}/sheets/${SheetId}/blueprints`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
      throw new Error(`Failed to create SheetBlueprint: ${response.status}`)
    }

    return response.data
}