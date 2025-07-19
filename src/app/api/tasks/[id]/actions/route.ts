import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }  
) {
  const { id } = await context.params

  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()

    const contentType = request.headers.get("content-type") || ""

    let response: Response

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      
      response = await fetch(`${process.env.API_URL}/api/tasks/${id}/action/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      })
    } else {
      // Handle JSON
      const body = await request.json()
      
      response = await fetch(`${process.env.API_URL}/api/tasks/${id}/action/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
    }

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}