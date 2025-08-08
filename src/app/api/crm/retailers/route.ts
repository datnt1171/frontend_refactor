import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"

export async function GET(request: Request) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    // Extract query parameters from the request
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    const externalUrl = `${process.env.DW_API_URL}/api/crm/retailers${queryString ? `?${queryString}` : ''}`
    console.log('Fetching retailers from:', externalUrl)
    
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