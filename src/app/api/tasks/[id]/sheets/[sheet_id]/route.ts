import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string, sheet_id: string }> }  
) {
  const { sheet_id } = await params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const response = await fetch(`${process.env.API_URL}/api/sheets/${sheet_id}/`, {
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string, sheet_id: string }> }
) {
  const { sheet_id } = await params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const body = await request.json()
    
    const response = await fetch(`${process.env.API_URL}/api/sheets/${sheet_id}/`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    })

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string, sheet_id: string }> }
) {
  const { sheet_id } = await params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const body = await request.json()
    
    const response = await fetch(`${process.env.API_URL}/api/sheets/${sheet_id}/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    })

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string, sheet_id: string }> }
) {
  const { sheet_id } = await params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const response = await fetch(`${process.env.API_URL}/api/sheets/${sheet_id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json"
      },
    })

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}