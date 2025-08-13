import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"
import type { TaskDetail, FactoryDetail, RetailerDetail } from "@/types"
import { NextResponse } from "next/server"

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }  
) {
  const { id } = await context.params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const response = await fetch(`${process.env.API_URL}/api/tasks/${id}/`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        "Accept-Language": session.locale,
      },
    })

    if (!response.ok) {
      return handleApiResponse(response)
    }

    // Fetch from dw
    const taskDetail: TaskDetail = await response.json()
    
    // Check if factory field
    const factoryField = taskDetail.data.find(item => item.field.field_type === "factory")
    if (factoryField) {
      const factory_id = factoryField.value
      const factoryResponse = await fetch(`${process.env.DW_API_URL}/api/crm/factories/${factory_id}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      })

      if (factoryResponse.ok) {
        const factory: FactoryDetail = await factoryResponse.json()
        factoryField.value = factory.factory_name
      }
    }
    
    // Check if retailer field
    const retailerField = taskDetail.data.find(item => item.field.field_type === "retailer")
    if (retailerField) {
      const retailer_id = retailerField.value
      const retailerResponse = await fetch(`${process.env.DW_API_URL}/api/crm/retailers/${retailer_id}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      })

      if (retailerResponse.ok) {
        const retailer: RetailerDetail = await retailerResponse.json()
        retailerField.value = retailer.name
      }
    }

    // Return the modified taskDetail
    return NextResponse.json(taskDetail)
    
  } catch (error: unknown) {
    return handleError(error)
  }
}