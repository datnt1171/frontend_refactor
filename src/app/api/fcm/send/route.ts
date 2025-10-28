import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"

export async function POST(request: Request) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()

    const body = await request.json()

    const response = await fetch(
      `${process.env.API_URL}/api/notifications/send/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )

    return handleApiResponse(response)
  } catch (error: unknown) {
    console.error("FCM notification send error:", error)
    return handleError(error)
  }
}