// app/api/auth/refresh/route.ts
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { ApiErrorResponse } from "@/types/common"
import type { TokenResponse } from "@/types/auth"
import { handleError } from "@/lib/utils/api"

export async function POST() {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get("refresh_token")?.value

    if (!refreshToken) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "No refresh token found" },
        { status: 401 }
      )
    }

    const response = await fetch(
      `${process.env.API_URL}/api/token/refresh/`,{
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken })
      }
    )

    if (!response.ok) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Refresh failed" },
        { status: 401 }
      )
    }

    const data: TokenResponse = await response.json()

    // Create response
    const nextResponse = NextResponse.json({ success: true })

    // Set new tokens as cookies
    nextResponse.cookies.set("access_token", data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 60, // 30 minutes
      path: "/",
    })

    if (data.refresh) {
      nextResponse.cookies.set("refresh_token", data.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      })
    }

    return nextResponse
  } catch (error: unknown) {
    return handleError(error)
  }
}