import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import axios from "axios"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Make request to Django backend
    const response = await axios.post(
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
    return NextResponse.json({
      success: true,
      user: { username },
    })
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message)

    // Format the error response properly
    const errorMessage = error.response?.data?.detail || error.response?.data || "Authentication failed"

    return NextResponse.json({ success: false, error: errorMessage }, { status: error.response?.status || 500 })
  }
}
