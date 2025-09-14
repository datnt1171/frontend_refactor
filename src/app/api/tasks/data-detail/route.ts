import { getSessionCookie, unauthorizedResponse, handleError } from "@/lib/utils/api"
import { NextResponse } from "next/server"
import type { PaginatedFactoryList, TaskDataDetail, PaginatedRetailerList } from "@/types"

export async function GET() {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const response = await fetch(`${process.env.API_URL}/api/tasks/data-detail/`, {
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
    
    // Replace name_of_customer (factory_code) with name_of_customer
    const updatedTaskDataDetails = TaskDataDetails.map((item: TaskDataDetail) => ({
      ...item,
      name_of_customer: factoryMap[item.name_of_customer] || item.name_of_customer
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
    
    // Replace retailer id with name
    const updatedTaskDataDetails2 = updatedTaskDataDetails.map((item: TaskDataDetail) => ({
      ...item,
      retailer: retailerMap[item.retailer] || item.retailer
    }))
    
    return NextResponse.json(updatedTaskDataDetails2)
    
  } catch (error: unknown) {
    return handleError(error)
  }
}