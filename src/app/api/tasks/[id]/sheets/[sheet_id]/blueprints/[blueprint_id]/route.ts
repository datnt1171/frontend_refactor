import { getSessionCookie, unauthorizedResponse, handleApiResponse, handleError } from "@/lib/utils/api"
import type { FinishingSheet } from '@/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string, sheet_id: string }> }  
) {
  const { sheet_id } = await params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const response = await fetch(`${process.env.API_URL}/api/sheets/finishing-sheets/${sheet_id}/`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        "Accept-Language": session.locale,
      },
    })

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}

const removeReadOnlyFields = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => removeReadOnlyFields(item));
  }
  
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip read-only fields
      if (!['id', 'created_by', 'created_at', 'updated_by', 'updated_at'].includes(key)) {
        cleaned[key] = removeReadOnlyFields(value);
      }
    }
    return cleaned;
  }
  
  return obj;
};

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string, sheet_id: string }> }
) {
  const { sheet_id } = await params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const body: FinishingSheet = await request.json()
    
    // Remove all read-only fields from the body and nested objects
    const cleanedBody = removeReadOnlyFields(body)

    const response = await fetch(`${process.env.API_URL}/api/sheets/finishing-sheets/${sheet_id}/`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cleanedBody),
    })

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string, sheet_id: string }> }
) {
  const { sheet_id } = await params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const body = await request.json()
    
    const response = await fetch(`${process.env.API_URL}/api/sheets/finishing-sheets/${sheet_id}/`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    })

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string, sheet_id: string }> }
) {
  const { sheet_id } = await params
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    const response = await fetch(`${process.env.API_URL}/api/sheets/finishing-sheets/${sheet_id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json"
      },
    })

    return handleApiResponse(response)
  } catch (error: unknown) {
    return handleError(error)
  }
}