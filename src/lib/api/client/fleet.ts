import { apiClient } from '@/lib/api/client/api';
import type {
    Trip,
    PatchedTrip,
    Stop,
    PatchedStop,
} from '@/types'

// Trip
export const createTrip = async (
  data: Pick<Trip, 'driver' | 'date' | 'license_plate'>
) => {
  const response = await apiClient(`/fleets/trips`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
      throw new Error(`Failed to create Trip: ${response.status}`)
    }

    return response.data
}

export const updateTrip = async (
  data: PatchedTrip
) => {
  const response = await apiClient(`/fleets/trips/${data.id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
      throw new Error(`Failed to update Trip: ${response.status}`)
    }

    return response.data
}

export const deleteTrip = async (
    tripId: string
) => {
const response = await apiClient(`/fleets/trips/${tripId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error(`Failed to delete Trip: ${response.status}`)
    }

    return response.data
}


// Stop
export const createStop = async (
  data: Pick<Stop, 'trip' | 'order' | 'location' | 'odometer' | 'toll_station'>
) => {
  const response = await apiClient(`/fleets/stops`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
      throw new Error(`Failed to create Stop: ${response.status}`)
    }

    return response.data
}

export const updateStop = async (
  stopId: string,
  data: PatchedStop
) => {
  const response = await apiClient(`/fleets/stops/${stopId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
      throw new Error(`Failed to update Stop: ${response.status}`)
    }

    return response.data
}

export const deleteStop = async (
    stopId: string
) => {
const response = await apiClient(`/fleets/stops/${stopId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error(`Failed to delete Stop: ${response.status}`)
    }

    return response.data
}