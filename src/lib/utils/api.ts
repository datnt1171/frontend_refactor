import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import type { ApiErrorResponse, 
  ValidationError,
  DetailError,
  ApiResponse,
  DjangoErrorResponse,
  ApiSuccessResponse,
  } from "@/types/common"

export async function getSessionCookie(): Promise<{ access_token: string | null; locale: string }> {
  const cookieStore = await cookies()
  const access_token = cookieStore.get("access_token")?.value || null
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en"
  return { access_token, locale }
}

export function unauthorizedResponse(): NextResponse<ApiErrorResponse> {
  return NextResponse.json<ApiErrorResponse>(
    { success: false, error: "No access token found" },
    { status: 401 }
  )
}

function isValidationError(error: any): error is ValidationError {
  if (!error || typeof error !== 'object') return false
  
  return Object.values(error).some(value => Array.isArray(value))
}

// Helper to check if error has detail structure
function isDetailError(error: any): error is DetailError {
  return error && typeof error === 'object' && typeof error.detail === 'string'
}

// Format validation errors into a readable message
function formatValidationErrors(errors: ValidationError): string {
  const messages: string[] = []
  
  for (const [field, fieldErrors] of Object.entries(errors)) {
    const fieldName = field === 'non_field_errors' ? '' : `${field}: `
    messages.push(`${fieldName}${fieldErrors.join(', ')}`)
  }
  
  return messages.join('; ')
}

export async function handleApiError(response: Response): Promise<NextResponse<ApiErrorResponse>> {
  let errorMessage = "Request failed"
  let validationErrors: ValidationError | undefined
  
  try {
    const errorData: DjangoErrorResponse = await response.json()
    
    if (isValidationError(errorData)) {
      // Case 2: 400 validation errors
      validationErrors = errorData
      errorMessage = formatValidationErrors(errorData)
    } else if (isDetailError(errorData)) {
      // Case 3: Other errors with detail
      errorMessage = errorData.detail
    } else if (typeof errorData === 'string') {
      // Edge case: plain string response
      errorMessage = errorData
    } else {
      // Fallback for unexpected structures
      errorMessage = JSON.stringify(errorData)
    }
  } catch {
    // JSON parsing failed, use status text
    errorMessage = response.statusText || `HTTP ${response.status}`
  }
  console.error("ERROR: ",errorMessage)
  const errorResponse: ApiErrorResponse = {
    success: false,
    error: errorMessage,
    ...(validationErrors && { validationErrors })
  }
  
  return NextResponse.json(errorResponse, { status: response.status })
}

export async function handleApiSuccess<T = any>(response: Response): Promise<NextResponse<ApiSuccessResponse<T>>> {
  try {
    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    // JSON parsing failed on success response - this shouldn't happen but handle gracefully
    throw new Error("Failed to parse success response JSON")
  }
}

export async function handleApiResponse<T = any>(response: Response): Promise<NextResponse<ApiResponse<T>>> {
  if (!response.ok) {
    return handleApiError(response)
  }
  
  try {
    return await handleApiSuccess<T>(response)
  } catch {
    // If success parsing fails, return error
    const errorResponse: ApiErrorResponse = {
      success: false,
      error: "Invalid response format"
    }
    return NextResponse.json(errorResponse, { status: 500 })
  }
}

export function handleError(error: unknown): NextResponse<ApiErrorResponse> {
  const errorMessage = error instanceof Error ? error.message : "Authentication failed"
  
  return NextResponse.json<ApiErrorResponse>(
    { success: false, error: errorMessage },
    { status: 500 }
  )
}