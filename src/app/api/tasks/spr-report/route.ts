import { getSessionCookie, unauthorizedResponse, handleError } from "@/lib/utils/api"
import { NextResponse } from "next/server"
import type { PaginatedFactoryList, SPRReportRow } from "@/types"

export async function GET() {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const response = await fetch(`${process.env.API_URL}/api/tasks/spr-report/`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        "Accept-Language": session.locale,
      },
    })

    const SPReport: SPRReportRow[] = await response.json()

    const factoryResponse = await fetch(`${process.env.DW_API_URL}/api/crm/factories?limit=999999`, {
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
    
    // Replace customer_name (factory_code) with factory_name
    const updatedSPReport = SPReport.map((item: SPRReportRow) => ({
      ...item,
      customer_name: factoryMap[item.customer_name] || item.customer_name
    }))
    
    return NextResponse.json(updatedSPReport)
    
  } catch (error: unknown) {
    return handleError(error)
  }
}