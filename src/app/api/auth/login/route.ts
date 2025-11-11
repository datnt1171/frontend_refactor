import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { UserDetail } from "@/types/api"
import type { 
  LoginRequest, 
  TokenResponse, 
  LoginSuccessResponse, 
  LoginErrorResponse,
  ApiErrorResponse,
} from "@/types"

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
    if (!response.ok) {
      const data = await response.json()
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          error: data.detail
        },
        { status: response.status }
      ) 
    }

    const data: TokenResponse = await response.json();

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
    cookieStore.set("role", user.role.name, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    })

    cookieStore.set("department", user.department.name, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    })
    return NextResponse.json<LoginSuccessResponse>({
      success: true,
      requiresPasswordChange: !user.is_password_changed,
      department: user.department.name,
      role: user.role.name
    })
    }
    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        error: "Login Failed"
      },
      { status: response.status }
    ) 
  } catch (error: unknown) {
    let errorMessage = "Authentication failed"
    const statusCode = 500
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