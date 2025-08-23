import { api } from '@/lib/api/server/api'
import type {FinishingSheet, PaginatedFinishingSheetList, GetFinishingSheetsParams} from '@/types'

export async function getFinishingSheets(
  taskId: string,
  params: GetFinishingSheetsParams = {}
): Promise<PaginatedFinishingSheetList> {
  const searchParams = new URLSearchParams()
  
  // Add all non-undefined parameters to the query string
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value.toString())
    }
  })
  
  const queryString = searchParams.toString()
  const endpoint = `/tasks/${taskId}/sheets${queryString ? `?${queryString}` : ''}`
  
  const response = await api(endpoint)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch finishing sheets: ${response.status} ${response.statusText}`)
  }
  
  return await response.json()
}

export async function getFinishingSheet(
  taskId: string, 
  sheetId: string
): Promise<FinishingSheet> {
  const endpoint = `/tasks/${taskId}/sheets/${sheetId}`
  
  const response = await api(endpoint)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch finishing sheet: ${response.status} ${response.statusText}`)
  }
  
  return await response.json()
}