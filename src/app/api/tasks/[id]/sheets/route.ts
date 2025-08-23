import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"
import { NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  
) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()

    const { id } = await params
    const { searchParams } = request.nextUrl

    const query = new URLSearchParams(searchParams)
    query.set("task", id)

    const url = `${process.env.API_URL}/api/sheets/?${query.toString()}`
    
    const response = await fetch(url, {
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  
) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()

    const { id } = await params
    const body = await request.json()

    // Always enforce task=id
    const payload = {
      ...body,
      task: id,
    }

    const response = await fetch(`${process.env.API_URL}/api/sheets/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}
