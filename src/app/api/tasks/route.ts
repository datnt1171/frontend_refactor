import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import axios from "axios"
import FormData from "form-data"
import type { ApiErrorResponse } from "@/types/common"

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || ""
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value

    if (!token) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Handle multipart/form-data
    if (contentType.startsWith("multipart/form-data")) {
      const form = await request.formData()
      const nodeForm = new FormData()

      for (const [key, value] of form.entries()) {
        if (
          typeof value === "object" &&
          "arrayBuffer" in value &&
          "name" in value &&
          "type" in value
        ) {
          const buffer = Buffer.from(await value.arrayBuffer())
          console.log("BFF received file:", {
            key,
            name: value.name,
            type: value.type,
            size: buffer.length
          })
          nodeForm.append(key, buffer, {
            filename: value.name,
            contentType: value.type || 'application/octet-stream',
          })
        } else {
          console.log("BFF received value:", { key, value })
          nodeForm.append(key, value as string)
        }
      }

      console.log("Sending FormData to DRF with keys:", Array.from(form.keys()))

      const response = await axios.post(
        `${process.env.API_URL}/api/tasks/`,
        nodeForm,
        {
          headers: {
            ...nodeForm.getHeaders(),
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000, // 30 second timeout for file uploads
        }
      )

      return NextResponse.json(response.data)
    }

    // Handle application/json
    const body = await request.json()
    console.log("Task JSON body being sent to API:", body)

    const response = await axios.post(
      `${process.env.API_URL}/api/tasks/`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout for JSON requests
      }
    )

    return NextResponse.json(response.data)
  } catch (error: unknown) {
    console.error("Task creation error:", error)
    
    let errorMessage = "Task creation failed"
    let statusCode = 500

    // Handle Axios errors
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error status
        const responseData = error.response.data
        statusCode = error.response.status

        // Handle DRF validation errors (typical structure)
        if (typeof responseData === 'object' && responseData !== null) {
          // Check for non_field_errors first (common in DRF)
          if (responseData.non_field_errors && Array.isArray(responseData.non_field_errors)) {
            errorMessage = responseData.non_field_errors[0]
          }
          // Check for detail field (common for single errors)
          else if (responseData.detail) {
            errorMessage = responseData.detail
          }
          // Handle field-specific validation errors
          else {
            // Extract the first error from any field
            const errorEntries = Object.entries(responseData)
            if (errorEntries.length > 0) {
              const firstEntry = errorEntries[0]
              if (firstEntry) {
                const [fieldName, fieldErrors] = firstEntry
                if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                  errorMessage = `${fieldName}: ${fieldErrors[0]}`
                } else if (typeof fieldErrors === 'string') {
                  errorMessage = `${fieldName}: ${fieldErrors}`
                }
              }
            }
          }
        }
        // Handle string responses
        else if (typeof responseData === 'string') {
          errorMessage = responseData
        }
        // Fallback to status text
        else {
          errorMessage = error.response.statusText || errorMessage
        }
      } else if (error.request) {
        // Network error (no response received)
        errorMessage = "Network error - cannot reach API server"
        statusCode = 503
      } else {
        // Request setup error
        errorMessage = "Request configuration error"
        statusCode = 500
      }
    }
    // Handle timeout errors specifically
    else if (error instanceof Error && error.message.includes('timeout')) {
      errorMessage = "Request timeout - please try again"
      statusCode = 408
    }
    // Handle generic JavaScript errors
    else if (error instanceof Error) {
      errorMessage = error.message
    }

    // Log error details for debugging
    console.error("Detailed error:", {
      message: errorMessage,
      status: statusCode,
      originalError: error instanceof Error ? error.message : 'Unknown error'
    })

    return NextResponse.json<ApiErrorResponse>(
      { success: false, error: errorMessage },
      { status: statusCode }
    )
  }
}