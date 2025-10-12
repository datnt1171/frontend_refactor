import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }  
) {
  const { id } = await params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()

    const form = await request.formData()
    console.log("create file for task", id)
    const response = await fetch(
      `${process.env.API_URL}/api/tasks/${id}/upload-files/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: form,
      }
    )

    return handleApiResponse(response)
  } catch (error: unknown) {
    console.error("File upload error:", error)
    return handleError(error)
  }
}