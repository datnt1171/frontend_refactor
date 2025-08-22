// src/app/api/crm/factories/[id]/blueprints/route.ts
import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()

    const queryString = `factory=${id}`
    
    const externalUrl = `${process.env.DW_API_URL}/api/crm/blueprints?${queryString}`
    
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

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    // Get the form data from the request
    const formData = await request.formData()
    
    // Ensure factory matches the route parameter
    formData.set('factory', id)
    
    const response = await fetch(`${process.env.DW_API_URL}/api/crm/blueprints`, {
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