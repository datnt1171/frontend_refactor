// lib/api/server/api.ts
import { cookies } from 'next/headers'

const refreshTokens = async (): Promise<string | null> => {
  try {
    const cookieStore = await cookies()
    const cookieHeader = cookieStore.toString()

    // Call your refresh route - it will handle cookie setting
    const response = await fetch(`${process.env.NEXT_INTERNAL_URL}/auth/refresh/`, {
      method: 'POST',
      headers: { 
        "Cookie": cookieHeader,
        "Content-Type": "application/json"
      },
      credentials: 'include'
    })

    console.log('Refresh response:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      // Extract new access token from response if available
      const setCookieHeader = response.headers.get('set-cookie')
      console.log('Set-Cookie header:', setCookieHeader)
      
      // Try to extract access token from set-cookie header
      if (setCookieHeader) {
        const accessTokenMatch = setCookieHeader.match(/access_token=([^;]+)/)
        if (accessTokenMatch) {
          return accessTokenMatch[1] ?? null
        }
      }
    }
    
    return null
  } catch (error) {
    console.error('Token refresh failed:', error)
    return null
  }
}

export const api = async (endpoint: string, options: RequestInit = {}) => {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  console.log('first attempt')
  
  // First attempt
  let response = await fetch(`${process.env.NEXT_INTERNAL_URL}${endpoint}`, {
    ...options,
    headers: {
      Cookie: cookieHeader,
      ...options.headers,
    },
    credentials: 'include',
  })
  
  // If unauthorized, try to refresh token
  if (response.status === 401) {
    console.log('Token expired, attempting refresh')
    const newAccessToken = await refreshTokens()
    
    if (newAccessToken) {
      console.log('Retrying with new token')
      
      // Build new cookie header with the fresh access token
      const newCookieStore = await cookies()
      const refreshToken = newCookieStore.get("refresh_token")?.value
      const newCookieHeader = `access_token=${newAccessToken}${refreshToken ? `; refresh_token=${refreshToken}` : ''}`
      
      response = await fetch(`${process.env.NEXT_INTERNAL_URL}${endpoint}`, {
        ...options,
        headers: {
          Cookie: newCookieHeader,
          ...options.headers,
        },
        credentials: 'include',
      })
      
      console.log('Retry result:', response.status)
    } else {
      console.log('Refresh failed')
    }
  }
  
  return response
}