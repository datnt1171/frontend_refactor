import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { ApiSuccessResponse } from "@/types/common"

export async function POST() {
  const cookieStore = await cookies()

  // Clear auth cookies
  cookieStore.delete("access_token")
  cookieStore.delete("refresh_token")

  return NextResponse.json<ApiSuccessResponse>({ success: true })
}
