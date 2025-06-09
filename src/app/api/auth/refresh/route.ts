import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import axios from "axios"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const refreshToken = cookieStore.get("refresh_token")?.value

    if (!refreshToken) {
      return NextResponse.json(
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

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Token refresh error:", error.response?.data || error.message)
    
    // Clear both tokens on refresh failure
    const cookieStore = await cookies()
    cookieStore.delete("access_token")
    cookieStore.delete("refresh_token")

    return NextResponse.json(
      { 
        success: false, 
        error: "Token refresh failed. Please login again." 
      },
      { status: 401 }
    )
  }
}
