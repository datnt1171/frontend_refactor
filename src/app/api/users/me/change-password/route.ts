import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"

export async function PATCH(request: Request) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()

    const body = await request.json()

    const response = await fetch(
      `${process.env.API_URL}/api/users/me/change-password/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}