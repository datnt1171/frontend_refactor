import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import axios from "axios"
import FormData from "form-data"

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || ""
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Handle multipart/form-data
    if (contentType.startsWith("multipart/form-data")) {
      const form = await request.formData()
      const nodeForm = new FormData()

      for (const [key, value] of form.entries()) {
        if (
          typeof value === "object" &&
          "arrayBuffer" in value &&
          "name" in value &&
          "type" in value
        ) {
          const buffer = Buffer.from(await value.arrayBuffer())
          nodeForm.append(key, buffer, {
            filename: value.name,
            contentType: value.type,
          })
        } else {
          nodeForm.append(key, value as string)
        }
      }

      const response = await axios.post(
        `${process.env.API_URL}/api/tasks/`,
        nodeForm,
        {
          headers: {
            ...nodeForm.getHeaders(),
            Authorization: `Bearer ${token}`,
          },
        }
      )

      return NextResponse.json(response.data)
    }

    // Handle application/json
    const body = await request.json()
    console.log("Task JSON body being sent to API:", body)

    const response = await axios.post(
      `${process.env.API_URL}/api/tasks/`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )

    return NextResponse.json(response.data)
  } catch (error: any) {
    const status = error.response?.status || 500
    const message = error.response?.data || "Failed to create task"
    console.error("Task creation failed:", message)
    console.error("Task creation failed:", JSON.stringify(message, null, 2))
    return NextResponse.json({ error: message }, { status })
  }
}
