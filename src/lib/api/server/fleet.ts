import { api } from '@/lib/api/server/api'
import type {
    PaginatedTripList, 
    Trip, 
    PaginatedStopList, 
    Stop,
    TripLog,
} from '@/types'

export const getTrips = async (searchParams?: Record<string, string>): Promise<PaginatedTripList> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/fleets/trips?${queryString}` : '/fleets/trips'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch trips: ${res.status}`)
  return res.json()
}

export const getTrip = async (id: string): Promise<Trip> => {
  const res = await api(`/fleets/trips/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch trip: ${res.status}`)
  return res.json()
}


export const getStops = async (searchParams?: Record<string, string>): Promise<PaginatedStopList> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/fleets/stops?${queryString}` : '/fleets/stops'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch stops: ${res.status}`)
  return res.json()
}

export const getStop = async (id: string): Promise<Stop> => {
  const res = await api(`/fleets/stops/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch stop: ${res.status}`)
  return res.json()
}

export const getTripLogs = async (searchParams?: Record<string, string>): Promise<TripLog[]> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/fleets/trip-logs?${queryString}` : '/fleets/trip-logs'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch trip logs: ${res.status}`)
  return res.json()
}