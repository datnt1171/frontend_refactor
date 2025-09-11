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
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "vi"
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
function formatValidationErrors(errors: any, parentKey = ""): string {
  const messages: string[] = []

  if (Array.isArray(errors)) {
    errors.forEach((item, index) => {
      const key = parentKey ? `${parentKey}[${index}]` : `[${index}]`
      messages.push(formatValidationErrors(item, key))
    })
  } else if (typeof errors === "object" && errors !== null) {
    for (const [field, value] of Object.entries(errors)) {
      const key = parentKey ? `${parentKey}.${field}` : field
      messages.push(formatValidationErrors(value, key))
    }
  } else {
    // primitive (usually string message)
    const fieldName = parentKey ? `${parentKey}: ` : ""
    messages.push(`${fieldName}${String(errors)}`)
  }

  return messages.join("\n")
}

export async function handleApiError(response: Response): Promise<NextResponse<ApiErrorResponse>> {
  let errorMessage = "Request failed"
  let validationErrors: ValidationError | undefined
  let rawBody: string | null = null

  try {
    // read the raw response text
    rawBody = await response.clone().text()

    // try parsing JSON
    const errorData: DjangoErrorResponse = JSON.parse(rawBody)

    if (isValidationError(errorData)) {
      validationErrors = errorData
      errorMessage = formatValidationErrors(errorData)
    } else if (isDetailError(errorData)) {
      errorMessage = errorData.detail
    } else if (typeof errorData === "string") {
      errorMessage = errorData
    } else {
      errorMessage = JSON.stringify(errorData, null, 2)
    }
  } catch (err) {
    // JSON parsing failed, fallback to status
    errorMessage = response.statusText || `HTTP ${response.status}`
  }

  // improved structured logging
  console.error("API ERROR:", {
    status: response.status,
    url: response.url,
    rawBody,
    parsedError: errorMessage
  })

  const errorResponse: ApiErrorResponse = {
    success: false,
    error: errorMessage,
    ...(validationErrors && { validationErrors })
  }

  return NextResponse.json(errorResponse, { status: response.status })
}

export async function handleApiSuccess<T = any>(response: Response): Promise<NextResponse<ApiSuccessResponse<T>>> {
  // Handle 204 No Content - no JSON body expected
  if (response.status === 204) {
    return new NextResponse(null, { status: 204 })
  }
  
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