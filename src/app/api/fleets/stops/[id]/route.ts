import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"
import { NextRequest } from "next/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  
) {
  const { id } = await params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const response = await fetch(`${process.env.API_URL}/api/fleets/stops/${ id }/`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
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
  { params }: { params: Promise<{ id: string }> }  
) {
  const { id } = await params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const body = await request.json()
    
    const response = await fetch(`${process.env.API_URL}/api/fleets/stops/${id}/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  
) {
  const { id } = await params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const response = await fetch(`${process.env.API_URL}/api/fleets/stops/${id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}