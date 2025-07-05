import { getAuthToken, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"

export async function PATCH(request: Request) {
  try {
    const token = await getAuthToken()
    if (!token) return unauthorizedResponse()

    const body = await request.json()

    const response = await fetch(
      `${process.env.API_URL}/api/users/me/change-password/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
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