import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"

export async function POST(request: Request) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    // Get the form data from the request
    const formData = await request.formData()
    
    // Forward to FastAPI DW service
    const response = await fetch(`${process.env.DW_API_URL}/api/etl/sales`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: formData,
    })

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}