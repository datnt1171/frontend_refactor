import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import type { ApiErrorResponse } from "@/types/common"
import type { TokenResponse } from "@/types/auth"
import { jwtDecode } from "jwt-decode"

interface JwtPayload {
  exp: number
  [key: string]: any
}

export async function getAuthToken(): Promise<string | null> {
  console.log('get auth token')
  const cookieStore = await cookies()
  let accessToken = cookieStore.get("access_token")?.value

  // If no access token, return null
  if (!accessToken) {
    console.log('no access_token')
    return null
  }

  try {
    // Check if token is expired or expires soon (within 5 minutes)
    const decoded = jwtDecode<JwtPayload>(accessToken)
    const currentTime = Math.floor(Date.now() / 1000)
    const bufferTime = 5 * 60 // 5 minutes buffer
    
    if (decoded.exp <= currentTime + bufferTime) {
      console.log('refresh expire soon')
      // Token expired or expiring soon, try to refresh
      const newToken = await refreshAccessToken()
      if (newToken) {
        return newToken
      }
      console.log('can not refresh')
      return null
    }
    console.log('have access token')
    return accessToken
  } catch (error) {
    console.log('error')
    // Invalid token format, try to refresh
    const newToken = await refreshAccessToken()
    return newToken
  }
}

async function refreshAccessToken(): Promise<string | null> {
  console.log('refreshing')
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get("refresh_token")?.value

    if (!refreshToken) {
      console.log('no refresh_token')
      clearAuthCookies()
      return null
    }

    const response = await fetch(`${process.env.API_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken })
    })

    if (!response.ok) {
      clearAuthCookies()
      return null
    }

    const data: TokenResponse = await response.json()

    if (data.access) {
      // Update cookies with new tokens
      cookieStore.set("access_token", data.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1 * 60,
        path: "/",
      })

      // Always update refresh token since ROTATE_REFRESH_TOKENS: True
      cookieStore.set("refresh_token", data.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      })

      return data.access
    }

    clearAuthCookies()
    return null
  } catch (error) {
    console.error('Token refresh failed:', error)
    clearAuthCookies()
    return null
  }
}

async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("access_token")
  cookieStore.delete("refresh_token")
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