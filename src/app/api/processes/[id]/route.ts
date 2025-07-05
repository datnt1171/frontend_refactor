import { headers } from "next/headers"
import { getAuthToken, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }  
) {
  const { id } = await context.params
  try {
    const token = await getAuthToken()
    if (!token) return unauthorizedResponse()

    const headersList = await headers()
    const acceptLanguage = headersList.get("accept-language") || "en-US,en;q=0.9"
    
    const response = await fetch(`${process.env.API_URL}/api/processes/${ id }/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept-Language": acceptLanguage,
      },
    })

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}