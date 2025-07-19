// lib/api/server/api.ts
import { cookies } from 'next/headers'
export const api = async (endpoint: string, options: RequestInit = {}) => {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  let response = await fetch(`${process.env.NEXT_INTERNAL_URL}${endpoint}`, {
    ...options,
    headers: {
      Cookie: cookieHeader,
      ...options.headers,
    },
    credentials: 'include',
  })
  return response
}