import { getSessionCookie, unauthorizedResponse, handleError } from "@/lib/utils/api"
import { NextRequest, NextResponse } from "next/server"
import type { PaginatedFactoryList, TaskDataDetail, PaginatedRetailerList } from "@/types"

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const apiUrl = new URL(`${process.env.API_URL}/api/tasks/data-detail/`)
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

    const TaskDataDetails: TaskDataDetail[] = await response.json()

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
    
    // Add factory_name field while keeping name_of_customer (factory_code)
    const updatedTaskDataDetails = TaskDataDetails.map((item: TaskDataDetail) => ({
      ...item,
      factory_name: factoryMap[item.name_of_customer] || ""
    }))

    // Retailer
    const retailerResponse = await fetch(`${process.env.DW_API_URL}/api/crm/retailers?page=1&page_size=999999`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
    }) 

    const PaginatedRetailer: PaginatedRetailerList = await retailerResponse.json()
    const dim_retailer = PaginatedRetailer.results
    interface RetailerMap {
      [key: string]: string
    }
    // Create retailer code to name mapping
    const retailerMap: RetailerMap = dim_retailer.reduce((map: RetailerMap, retailer) => {
      map[retailer.id] = retailer.name
      return map
    }, {})
    
    // Add retailer_name field while keeping retailer id
    const updatedTaskDataDetails2 = updatedTaskDataDetails.map((item: TaskDataDetail) => ({
      ...item,
      retailer_name: retailerMap[item.retailer] || ""
    }))
    
    return NextResponse.json(updatedTaskDataDetails2)
    
  } catch (error: unknown) {
    return handleError(error)
  }
}