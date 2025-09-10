import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const apiUrl = new URL(`${process.env.DW_API_URL}/api/crm/factories`)
    request.nextUrl.searchParams.forEach((value, key) => {
      apiUrl.searchParams.set(key, value)
    })
    
    const response = await fetch(apiUrl, {
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

export async function POST(request: Request) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const body = await request.json()
    
    const response = await fetch(`${process.env.DW_API_URL}/api/crm/factories`, {
      method: 'POST',
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