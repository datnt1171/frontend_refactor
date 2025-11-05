import { api } from '@/lib/api/server/api'
import type { 
  TaskDataDetail, 
  TaskActionDetail,
  OnsiteTransferAbsence,
  TransferAbsence,
  Overtime,
  OnsiteTransferAbsenceWithOvertime,
  DailyMovement,
 } from '@/types/api'

export const getDataDetails = async (searchParams?: Record<string, string>): Promise<TaskDataDetail[]> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/tasks/data-detail?${queryString}` : '/tasks/data-detail'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch task data detail: ${res.status}`)
  return res.json()
}

export const getDataDetail = async (id: string): Promise<TaskDataDetail> => {
  const res = await api(`/tasks/data-detail/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch task data detail: ${res.status}`)
  return res.json()
}

export const getActionDetail = async (searchParams?: Record<string, string>): Promise<TaskActionDetail[]> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/tasks/action-detail?${queryString}` : '/tasks/action-detail'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch task action detail: ${res.status}`)
  return res.json()
}


export const getOnsiteTransferAbsences = async (searchParams?: Record<string, string>): Promise<OnsiteTransferAbsence[]> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/tasks/onsite-transfer-absence?${queryString}` : '/tasks/onsite-transfer-absence'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch Onsite transfer absence: ${res.status}`)
  return res.json()
}

export const getTransferAbsences = async (searchParams?: Record<string, string>): Promise<TransferAbsence[]> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/tasks/transfer-absence?${queryString}` : '/tasks/transfer-absence'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch Transfer absence: ${res.status}`)
  return res.json()
}

export const getOvertimes = async (searchParams?: Record<string, string>): Promise<Overtime[]> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/tasks/overtime?${queryString}` : '/tasks/overtime'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch Overtime: ${res.status}`)
  return res.json()
}


export const getTechReport = async (searchParams?: Record<string, string>): Promise<OnsiteTransferAbsenceWithOvertime[]> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/tasks/tech-report?${queryString}` : '/tasks/tech-report'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch Tech report: ${res.status}`)
  return res.json()
}


export const getTechReportWorkYesterday = async (searchParams?: Record<string, string>): Promise<OnsiteTransferAbsenceWithOvertime[]> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/tasks/tech-report-work-ytd?${queryString}` : '/tasks/tech-report-work-ytd'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch Tech report: ${res.status}`)
  return res.json()
}

export const getDailyMovement = async (searchParams?: Record<string, string>): Promise<DailyMovement[]> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/tasks/daily-movement?${queryString}` : '/tasks/daily-movement'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch Daily Movement: ${res.status}`)
  return res.json()
}