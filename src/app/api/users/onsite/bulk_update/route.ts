import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const body = await request.json()
    
    const response = await fetch(`${process.env.API_URL}/api/users/onsite/bulk_update/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        "Accept-Language": session.locale,
      },
      body: JSON.stringify(body)
    })

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}