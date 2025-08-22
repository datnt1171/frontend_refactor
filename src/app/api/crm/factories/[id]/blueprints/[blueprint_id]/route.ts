import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"
import { NextRequest } from "next/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; blueprint_id: string }> }
) {

  const { blueprint_id } = await params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    
    const externalUrl = `${process.env.DW_API_URL}/api/crm/blueprints/${blueprint_id}`
    
    const response = await fetch(externalUrl, {
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string; blueprint_id: string }> }
) {

  const { id, blueprint_id } = await params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const body = await request.json()
    const externalUrl = `${process.env.DW_API_URL}/api/crm/blueprints/${blueprint_id}`

    const response = await fetch(externalUrl, {
      method: 'PUT',
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
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; blueprint_id: string }> }
) {

  const { id, blueprint_id } = await params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
  
    const externalUrl = `${process.env.DW_API_URL}/api/crm/blueprints/${blueprint_id}`
    const response = await fetch(externalUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
    })

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}