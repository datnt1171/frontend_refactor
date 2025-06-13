import { NextResponse } from "next/server"
import { cookies, headers } from "next/headers"
import axios from "axios"
import type { ApiErrorResponse } from "@/types/common"
import type { Process } from "@/types/backend/process"
import type { PaginatedResponse } from "@/types/backend/pagination"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    if (!token) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const headersList = await headers()
    const acceptLanguage = headersList.get("accept-language") || "en-US,en;q=0.9"

    const response = await axios.get<PaginatedResponse<Process>>(
      `${process.env.API_URL}/api/processes/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept-Language": acceptLanguage,
        },
      }
    )

    return NextResponse.json<PaginatedResponse<Process>>(response.data)
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
