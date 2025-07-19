import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import type { ApiErrorResponse } from "@/types/common"

export async function getSessionCookie(): Promise<{ access_token: string | null; locale: string }> {
  const cookieStore = await cookies()
  const access_token = cookieStore.get("access_token")?.value || null
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en"
  return { access_token, locale }
}

export function unauthorizedResponse(): NextResponse<ApiErrorResponse> {
  return NextResponse.json<ApiErrorResponse>(
    { success: false, error: "Unauthorized" },
    { status: 401 }
  )
}

export async function handleApiResponse(response: Response): Promise<NextResponse> {
  if (!response.ok) {
    let errorMessage = "Authentication failed"
    try {
      const errorData = await response.json()
      errorMessage = errorData?.detail || errorData || response.statusText
    } catch {
      errorMessage = response.statusText
    }
    
    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: errorMessage },
      { status: response.status }
    )
  }

  const data = await response.json()
  return NextResponse.json(data)
}

export function handleError(error: unknown): NextResponse<ApiErrorResponse> {
  const errorMessage = error instanceof Error ? error.message : "Authentication failed"
  
  return NextResponse.json<ApiErrorResponse>(
    { success: false, error: errorMessage },
    { status: 500 }
  )
}