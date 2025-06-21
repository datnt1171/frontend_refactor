import { cookies } from 'next/headers'
import type { PaginatedProcessListList, PaginatedReceivedTaskList } from '@/types/api'

export const getProcessesServer = async (): Promise<PaginatedProcessListList> => {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/processes/`, {
    headers: {
      Cookie: cookieHeader,
    },
    cache: 'no-store',
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch processes: ${res.status}`)
  }
  return res.json()
}

export const getReceivedTasksServer = async (): Promise<PaginatedReceivedTaskList> => {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/received/`, {
    headers: {
      Cookie: cookieHeader,
    },
    cache: 'no-store',
    credentials: 'include',
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch Received tasks: ${res.status}`)
  }
  return res.json()
}
