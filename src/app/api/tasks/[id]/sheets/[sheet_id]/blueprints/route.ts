import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"
import { NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, sheet_id: string }> }  
) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()

    const { sheet_id } = await params
    const { searchParams } = request.nextUrl

    const query = new URLSearchParams(searchParams)
    query.set("finishing_sheet", sheet_id)

    const url = `${process.env.API_URL}/api/sheets/sheet-blueprints/?${query.toString()}`
    
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
  { params }: { params: Promise<{ id: string, sheet_id: string }> }  
) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()

    const { sheet_id } = await params
    const body = await request.json()

    // Always enforce finishing_sheet=sheet_id
    const payload = {
      ...body,
      finishing_sheet: sheet_id,
    }

    const response = await fetch(`${process.env.API_URL}/api/sheets/sheet-blueprints/`, {
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
