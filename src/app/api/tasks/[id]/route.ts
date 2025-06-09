import { NextResponse } from "next/server"
import { cookies, headers } from "next/headers"
import axios from "axios"

export async function GET(
  request: Request, 
  context: {params: { id: string } }
  ) {
  
  const { id } = await context.params

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const headersList = await headers()
    const acceptLanguage = headersList.get("accept-language") || "en-US,en;q=0.9"

    const response = await axios.get(`${process.env.API_URL}/api/tasks/${ id }/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept-Language": acceptLanguage,
      },
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("Error fetching task:", error.response?.data || error.message)
    return NextResponse.json(
      { error: error.response?.data || "Failed to fetch task" },
      { status: error.response?.status || 500 },
    )
  }
}
