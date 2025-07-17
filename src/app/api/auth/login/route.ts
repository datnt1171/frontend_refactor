import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { UserDetail } from "@/types/api"
import type { 
  LoginRequest, 
  TokenResponse, 
  LoginSuccessResponse, 
  LoginErrorResponse
} from "@/types/auth"

export async function POST(request: Request): Promise<NextResponse<LoginSuccessResponse | LoginErrorResponse>> {
  try {
    const { username, password }: LoginRequest = await request.json()

    // Make request to Django backend
    const response = await fetch(
      `${process.env.API_URL}/api/token/`,
      {
        method: 'POST',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ username, password }),
      }
    )

    const data: TokenResponse = await response.json();
    // Get user profile to check password status
    const userResponse = await fetch(
      `${process.env.API_URL}/api/users/me/`,
      { 
        headers: { 
          "Authorization": `Bearer ${data.access}`,
          "Content-Type": "application/json" 
        } 
      }
    )

    const user: UserDetail = await userResponse.json()

    if (response.ok && data.access && data.refresh) {
    // Set cookies
    const cookieStore = await cookies()

    // Access token - longer expiry (30 minutes)
    cookieStore.set("access_token", data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60, // 30 minutes in seconds
      path: "/",
    })

    // Refresh token - longer expiry (e.g., 7 days)
    cookieStore.set("refresh_token", data.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    })
    }

    return NextResponse.json<LoginSuccessResponse>({
      success: true,
      requiresPasswordChange: !user.is_password_changed
    })
  } catch (error: unknown) {
    let errorMessage = "Authentication failed"
    let statusCode = 500
    // Handle generic JS error
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json<LoginErrorResponse>(
      { success: false, error: errorMessage },
      { status: statusCode }
    )
  }
}