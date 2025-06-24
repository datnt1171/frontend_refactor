import { cookies } from 'next/headers'

export const api = async (endpoint: string, options: RequestInit = {}) => {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const language = cookieStore.get('NEXT_LOCALE')?.value || 'en'
  
  return fetch(`${process.env.NEXT_INTERNAL_URL}${endpoint}`, {
    ...options,
    headers: {
      Cookie: cookieHeader,
      'Accept-Language': language,
      ...options.headers,
    },
    credentials: 'include',
  })
}