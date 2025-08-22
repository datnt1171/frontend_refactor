import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }  
) {
  const { id } = await params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const response = await fetch(`${process.env.API_URL}/api/users/${ id }/`, {
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
