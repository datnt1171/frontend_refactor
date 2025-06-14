import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import axios from "axios"
import type { ApiSuccessResponse, ApiErrorResponse } from "@/types/common"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get("refresh_token")?.value

    if (!refreshToken) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "No refresh token found" },
        { status: 401 }
      )
    }

    const response = await axios.post(
      `${process.env.API_URL}/api/token/refresh/`,
      { refresh: refreshToken },
      { headers: { "Content-Type": "application/json" } }
    )

    if (!response.data.access) {
      throw new Error("No access token received")
    }

    // Set new access token cookie
    cookieStore.set("access_token", response.data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60,
      path: "/",
    })

    return NextResponse.json<ApiSuccessResponse>({ success: true })
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