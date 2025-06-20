import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import axios from "axios"
import type { ApiErrorResponse } from "@/types/common"
import type { SetPasswordRetype } from "@/types/api"

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    if (!token) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body: SetPasswordRetype = await request.json()

    const response = await axios.post(
      `${process.env.API_URL}/auth/users/set_password/`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

    return NextResponse.json(response.data)
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
