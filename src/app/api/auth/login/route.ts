import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import axios from "axios"
import type { LoginRequest, TokenResponse } from "@/types/auth"
import type { ApiSuccessResponse, ApiErrorResponse } from "@/types/common"

export async function POST(request: Request): Promise<NextResponse<ApiSuccessResponse | ApiErrorResponse>> {
  try {
    const { username, password }: LoginRequest = await request.json()

    // Make request to Django backend
    const response = await axios.post<TokenResponse>(
      `${process.env.API_URL}/api/token/`,
      { username, password },
      { headers: { "Content-Type": "application/json" } },
    )

    const { access, refresh } = response.data

    // Set HTTP-only cookies
    const cookieStore = await cookies()

    // Access token - longer expiry (30 minutes)
    cookieStore.set("access_token", access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60, // 30 minutes in seconds
      path: "/",
    })

    // Refresh token - longer expiry (e.g., 7 days)
    cookieStore.set("refresh_token", refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    })

    // Return user info (without sensitive data)
    return NextResponse.json<ApiSuccessResponse>({
      success: true
    })
  } catch (error: unknown) {
    let errorMessage = "Authentication failed"
    let statusCode = 500

    // Handle Axios error
    if (axios.isAxiosError(error) && error.response) {
      errorMessage = error.response.data?.detail || error.response.data || error.message
      statusCode = error.response.status || 500
    }
    // Handle generic JS error
    else if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: errorMessage },
      { status: statusCode }
    )
  }
}
