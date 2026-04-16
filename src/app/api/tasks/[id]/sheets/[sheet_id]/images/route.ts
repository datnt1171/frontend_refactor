import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"
import { NextRequest } from "next/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; sheet_id: string }> }
) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()

    const { sheet_id } = await params

    const response = await fetch(
      `${process.env.API_URL}/api/sheets/sheet-images/?sheet=${sheet_id}`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Accept-Language": session.locale,
        },
      }
    )

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; sheet_id: string }> }
) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()

    const { sheet_id } = await params

    // Forward FormData as-is — do NOT parse as JSON
    const formData = await request.formData()
    formData.set('sheet', sheet_id) // enforce sheet id

    const response = await fetch(`${process.env.API_URL}/api/sheets/sheet-images/`, {
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