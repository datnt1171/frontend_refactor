import { api } from '@/lib/api/server/api'
import type {
  FinishingSheet, 
  PaginatedFinishingSheetList, 
  StepTemplate,
  FormularTemplate, 
  PaginatedSheetBlueprintList, 
  SheetBlueprint
} from '@/types'

export async function getFinishingSheets(
  taskId: string,
  searchParams?: Record<string, string>
): Promise<PaginatedFinishingSheetList> {

  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }

  const queryString = queryParams.toString()
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


export const getStepTemplates = async (): Promise<StepTemplate[]> => {
  const res = await api("/sheets/step-templates")
  if (!res.ok) throw new Error(`Failed to fetch Step template: ${res.status}`)
  return res.json()
}

export const getFormularTemplates = async (): Promise<FormularTemplate[]> => {
  const res = await api("/sheets/formular-templates")
  if (!res.ok) throw new Error(`Failed to fetch Formular template: ${res.status}`)
  return res.json()
}

export const getSheetBlueprints = async (taskId: string, sheetId : string): Promise<PaginatedSheetBlueprintList> => {
  const res = await api(`/tasks/${taskId}/sheets/${sheetId}/blueprints`)
  if (!res.ok) throw new Error(`Failed to fetch sheet blueprints: ${res.status}`)
  return res.json()
}

export const getSheetBlueprint = async (taskId: string, sheetId : string, blueprintId: string): Promise<SheetBlueprint> => {
  const res = await api(`/tasks/${taskId}/sheets/${sheetId}/blueprints/${blueprintId}`)
  if (!res.ok) throw new Error(`Failed to fetch sheet blueprint: ${res.status}`)
  return res.json()
}