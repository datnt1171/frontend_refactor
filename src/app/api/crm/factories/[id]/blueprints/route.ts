// src/app/api/crm/factories/[id]/blueprints/route.ts
import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const { id: factoryId } = params
    const { searchParams } = new URL(request.url)
    
    // Add factory filter to query params
    const factoryParam = `factory=${factoryId}`
    const existingParams = searchParams.toString()
    const queryString = existingParams ? `${factoryParam}&${existingParams}` : factoryParam
    
    const externalUrl = `${process.env.DW_API_URL}/api/crm/blueprints?${queryString}`
    console.log('Fetching factory blueprints from:', externalUrl)
    
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

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const { id: factoryId } = params
    
    // Get the form data from the request
    const formData = await request.formData()
    
    // Ensure factory matches the route parameter
    formData.set('factory', factoryId)
    
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