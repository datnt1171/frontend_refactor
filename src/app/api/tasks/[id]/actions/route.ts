import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import axios from "axios"

export async function POST(
  request: Request, 
  context: { params: { id: string } }
) {
  const { id } = await context.params

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let body: any
    let headers: any = {
      Authorization: `Bearer ${token}`,
    }

    // Detect content type
    const contentType = request.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      const fetchRes = await fetch(`${process.env.API_URL}/api/tasks/${id}/action/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      const data = await fetchRes.json()
      return NextResponse.json(data, { status: fetchRes.status })
    } else {
      // Handle JSON
      body = await request.json()
      headers["Content-Type"] = "application/json"
      const response = await axios.post(
        `${process.env.API_URL}/api/tasks/${id}/action/`,
        body,
        { headers }
      )
      return NextResponse.json(response.data)
    }
  } catch (error: any) {
    console.error("Error performing task action:", error.response?.data || error.message)
    return NextResponse.json(
      { error: error.response?.data || "Failed to perform task action" },
      { status: error.response?.status || 500 }
    )
  }
}
