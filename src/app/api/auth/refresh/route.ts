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

    // Set new tokens as cookies
    if (response.ok && data.access) {
      console.log('access and refresh')
      cookieStore.set("access_token", data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60,
      path: "/",
    })

      cookieStore.set("refresh_token", data.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })
    const userRole = cookieStore.get("user_role")?.value
    const userDept = cookieStore.get("user_department")?.value

    if (userRole) {
      cookieStore.set("role", userRole, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })
    }

    if (userDept) {
      cookieStore.set("department", userDept, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })
    }

    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    return handleError(error)
  }
}