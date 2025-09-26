import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"
import type { TaskDataDetail, FactoryDetail, RetailerDetail } from "@/types"
import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }  
) {
  const { id } = await params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const response = await fetch(`${process.env.API_URL}/api/tasks/data-detail/${id}/`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        "Accept-Language": session.locale,
      },
    })

    if (!response.ok) {
      return handleApiResponse(response)
    }

    const taskDataDetail: TaskDataDetail = await response.json()
    
    // Initialize the additional fields
    let factory_name: string = ""
    let retailer_name: string = ""

    // Factory - only fetch if factory_code exists
    if (taskDataDetail.factory_code) {
      try {
        const factoryResponse = await fetch(`${process.env.DW_API_URL}/api/crm/factories/${taskDataDetail.factory_code}`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        })
        
        if (factoryResponse.ok) {
          const factory: FactoryDetail = await factoryResponse.json()
          factory_name = factory.factory_name
        } else {
          console.warn(`Factory not found for code: ${taskDataDetail.factory_code} (Status: ${factoryResponse.status})`)
        }
      } catch (error) {
        console.warn('Failed to fetch factory details:', error)
        // Continue execution even if factory fetch fails
      }
    }

    // Retailer - only fetch if retailer exists
    if (taskDataDetail.retailer_id) {
      try {
        const retailerResponse = await fetch(`${process.env.DW_API_URL}/api/crm/retailers/${taskDataDetail.retailer_id}`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        })
        
        if (retailerResponse.ok) {
          const retailer: RetailerDetail = await retailerResponse.json()
          retailer_name = retailer.name
        } else {
          console.warn(`Retailer not found for id: ${taskDataDetail.retailer_id} (Status: ${retailerResponse.status})`)
        }
      } catch (error) {
        console.warn('Failed to fetch retailer details:', error)
        // Continue execution even if retailer fetch fails
      }
    }
    
    // Return the enhanced task detail
    const enhancedTaskDataDetail = {
      ...taskDataDetail,
      factory_name,
      retailer_name
    }
    return NextResponse.json(enhancedTaskDataDetail)
    
  } catch (error: unknown) {
    return handleError(error)
  }
}