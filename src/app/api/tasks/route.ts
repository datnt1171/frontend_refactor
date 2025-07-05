import { getAuthToken, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || ""
    const token = await getAuthToken()
    if (!token) return unauthorizedResponse()

    // Handle multipart/form-data
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData()
      
      // Log what we're sending
      for (const [key, value] of form.entries()) {
        if (value instanceof File) {
          console.log("BFF received file:", {
            key,
            name: value.name,
            type: value.type,
            size: value.size
          })
        } else {
          console.log("BFF received value:", { key, value })
        }
      }

      console.log("Sending FormData to DRF with keys:", Array.from(form.keys()))

      const response = await fetch(
        `${process.env.API_URL}/api/tasks/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        }
      )

      return handleApiResponse(response)
    }

    // Handle application/json
    const body = await request.json()
    console.log("Task JSON body being sent to API:", body)

    const response = await fetch(
      `${process.env.API_URL}/api/tasks/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )

    return handleApiResponse(response)
  } catch (error: unknown) {
    console.error("Task creation error:", error)
    return handleError(error)
  }
}