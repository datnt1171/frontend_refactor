import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import axios from "axios"
import type { ApiErrorResponse } from "@/types/common"

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    if (!token) {
      return NextResponse.json<ApiErrorResponse>(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      )
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    }

    const contentType = request.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      const fetchRes = await fetch(`${process.env.API_URL}/api/tasks/${id}/action/`, {
        method: "POST",
        headers,
        body: formData,
      })

      const data = await fetchRes.json()
      return NextResponse.json(data, { status: fetchRes.status })
    } else {
      const body = await request.json()
      headers["Content-Type"] = "application/json"

      const response = await axios.post(
        `${process.env.API_URL}/api/tasks/${id}/action/`,
        body,
        { headers }
      )

      return NextResponse.json(response.data)
    }
  } catch (error: unknown) {
    let errorMessage = "Failed to perform task action"
    let statusCode = 500

    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data || error.message
      statusCode = error.response?.status || 500
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    console.error("Error performing task action:", errorMessage)

    return NextResponse.json<ApiErrorResponse>(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    )
  }
}
