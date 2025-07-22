import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || ""
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()

    // Handle multipart/form-data
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData()
      const response = await fetch(
        `${process.env.API_URL}/api/tasks/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: form,
        }
      )

      return handleApiResponse(response)
    }

    // Handle application/json
    const body = await request.json()

    const response = await fetch(
      `${process.env.API_URL}/api/tasks/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
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