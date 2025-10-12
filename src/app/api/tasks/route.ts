import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"

export async function POST(request: Request) {
  const routeStartTime = Date.now()
  console.log('[ROUTE] Request received')
  
  try {
    const contentType = request.headers.get("content-type") || ""
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()

    const sessionTime = Date.now()
    console.log(`[ROUTE] Session validated in ${sessionTime - routeStartTime}ms`)

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData()
      const formParseTime = Date.now()
      console.log(`[ROUTE] FormData parsed in ${formParseTime - sessionTime}ms`)
      
      const backendStartTime = Date.now()
      const response = await fetch(
        `${process.env.API_URL}/api/tasks/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: form,
        }
      )

      const backendEndTime = Date.now()
      console.log(`[ROUTE] Backend response in ${backendEndTime - backendStartTime}ms`)
      console.log(`[ROUTE] Total route time: ${backendEndTime - routeStartTime}ms`)

      const responseData = await response.json()
      console.log('[ROUTE] Response data:', responseData)
      
      return new Response(JSON.stringify(responseData), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }

    // Handle application/json
    const body = await request.json()

    const response = await fetch(
      `${process.env.API_URL}/api/tasks/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )
    const responseData = await response.json()
    console.log('[ROUTE] Response data:', responseData)
    
    return new Response(JSON.stringify(responseData), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error: unknown) {
    console.error("[ROUTE] Error:", error)
    return handleError(error)
  }
}