import { getSessionCookie, unauthorizedResponse, handleError } from "@/lib/utils/api"
import { NextRequest, NextResponse } from "next/server"
import type { PaginatedFactoryList, TripLog } from "@/types"

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const apiUrl = new URL(`${process.env.API_URL}/api/fleets/trip-logs/`)
    request.nextUrl.searchParams.forEach((value, key) => {
      apiUrl.searchParams.set(key, value)
    })

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        "Accept-Language": session.locale,
      },
    })

    const tripLogs: TripLog[] = await response.json()

    // Factory
    const factoryResponse = await fetch(`${process.env.DW_API_URL}/api/crm/factories?page=1&page_size=999999`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
    }) 

    const PaginatedFactory: PaginatedFactoryList = await factoryResponse.json()
    const dim_factory = PaginatedFactory.results
    interface FactoryMap {
      [key: string]: string
    }
    // Create factory code to name mapping
    const factoryMap: FactoryMap = dim_factory.reduce((map: FactoryMap, factory) => {
      map[factory.factory_code] = factory.factory_name
      return map
    }, {})
    
    // Add factory_name field while keeping factory_code
    const updatedtripLogs = tripLogs.map((item: TripLog) => ({
      ...item,
      start_loc_factory_name: factoryMap[item.start_loc] || "",
      end_loc_factory_name: factoryMap[item.end_loc] || ""
    }))

    
    return NextResponse.json(updatedtripLogs)
    
  } catch (error: unknown) {
    return handleError(error)
  }
}