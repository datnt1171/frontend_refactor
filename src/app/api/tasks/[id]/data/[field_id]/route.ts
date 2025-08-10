import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"
import { NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; field_id: string }> }
) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const { id, field_id } = await params
    
    const response = await fetch(`${process.env.API_URL}/api/tasks/${id}/data/${field_id}/`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        "Accept-Language": session.locale,
      },
    })

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}


export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; field_id: string }> }
) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()

    const { id, field_id } = await params
    const contentType = request.headers.get('content-type')
    
    let body: FormData | string
    let headers: Record<string, string> = {
      Authorization: `Bearer ${session.access_token}`,
    }

    if (contentType?.includes('multipart/form-data')) {
      body = await request.formData()
    } else {
      body = await request.text()
      headers["Content-Type"] = "application/json"
    }
    
    const response = await fetch(`${process.env.API_URL}/api/tasks/${id}/data/${field_id}/`, {
      method: 'PATCH',
      headers,
      body,
    })

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}