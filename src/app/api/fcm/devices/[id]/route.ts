// app/api/fcm/devices/[id]/route.ts
import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()

    const response = await fetch(
      `${process.env.API_URL}/api/notifications/devices/${params.id}/`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    )

    return handleApiResponse(response)
  } catch (error: unknown) {
    console.error("FCM device deletion error:", error)
    return handleError(error)
  }
}