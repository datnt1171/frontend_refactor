import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; sheet_id: string; image_id: string }> }
) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()

    const { image_id } = await params

    const response = await fetch(
      `${process.env.API_URL}/api/sheets/sheet-images/${image_id}/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    )

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}