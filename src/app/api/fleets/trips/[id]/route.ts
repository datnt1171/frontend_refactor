import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"
import { NextRequest, NextResponse } from "next/server"
import type { PaginatedFactoryList, Trip } from "@/types"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  
) {
  const { id } = await params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const response = await fetch(`${process.env.API_URL}/api/fleets/trips/${id}/`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Accept-Language": session.locale,
      },
    })

    const trip: Trip = await response.json()

    // Factory
    const factoryResponse = await fetch(`${process.env.DW_API_URL}/api/crm/factories?page=1&page_size=999999`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
    }) 

    const paginatedFactory: PaginatedFactoryList = await factoryResponse.json()
    const dim_factory = paginatedFactory.results
    
    interface FactoryMap {
      [key: string]: string
    }
    
    // Create factory code to name mapping
    const factoryMap: FactoryMap = dim_factory.reduce((map: FactoryMap, factory) => {
      map[factory.factory_code] = factory.factory_name
      return map
    }, {})

    // Map factory names to stops
    const updatedTrip = {
      ...trip,
      stops: trip.stops.map(stop => ({
        ...stop,
        factory_name: factoryMap[stop.location] || ''
      }))
    }

    return NextResponse.json(updatedTrip)
    
  } catch (error: unknown) {
    return handleError(error)
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  
) {
  const { id } = await params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const body = await request.json()
    
    const response = await fetch(`${process.env.API_URL}/api/fleets/trips/${id}/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  
) {
  const { id } = await params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const response = await fetch(`${process.env.API_URL}/api/fleets/trips/${id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}