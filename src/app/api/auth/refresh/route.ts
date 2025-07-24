import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { ApiErrorResponse } from "@/types/common";
import type { TokenResponse } from "@/types/auth";
import { handleError } from "@/lib/utils/api";

// Cookie configuration
const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

const ACCESS_TOKEN_MAX_AGE = 30 * 60; // 30 minutes
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "No refresh token found" },
        { status: 401 }
      );
    }

    // Call backend refresh endpoint
    const response = await fetch(`${process.env.API_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: { 
        "Content-Type": "application/json",
        // Forward any additional headers if needed
        ...(process.env.API_KEY && { "Authorization": `Bearer ${process.env.API_KEY}` })
      },
      body: JSON.stringify({ refresh: refreshToken })
    });

    if (!response.ok) {
      // Clear invalid refresh token
      const errorResponse = NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Refresh token invalid or expired" },
        { status: 401 }
      );
      
      // Clear all auth-related cookies
      errorResponse.cookies.delete('refresh_token');
      errorResponse.cookies.delete('access_token');
      errorResponse.cookies.delete('role');
      errorResponse.cookies.delete('department');
      
      return errorResponse;
    }

    const data: TokenResponse = await response.json();

    // Validate response data
    if (!data.access) {
      return NextResponse.json<ApiErrorResponse>(
        { success: false, error: "Invalid token response" },
        { status: 500 }
      );
    }

    // Create success response
    const successResponse = NextResponse.json({ success: true });

    // Set new access token
    successResponse.cookies.set("access_token", data.access, {
      ...COOKIE_CONFIG,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    // Set new refresh token if provided
    if (data.refresh) {
      successResponse.cookies.set("refresh_token", data.refresh, {
        ...COOKIE_CONFIG,
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });
    }

    // Sync role and department cookies from stored user data
    const userRole = cookieStore.get("role")?.value;
    const userDept = cookieStore.get("department")?.value;

    if (userRole) {
      successResponse.cookies.set("role", userRole, {
        ...COOKIE_CONFIG,
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });
    }

    if (userDept) {
      successResponse.cookies.set("department", userDept, {
        ...COOKIE_CONFIG,
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });
    }

    return successResponse;

  } catch (error: unknown) {
    console.error('Token refresh error:', error);
    
    // Create error response and clear potentially invalid cookies
    const errorResponse = handleError(error);
    errorResponse.cookies.delete('refresh_token');
    errorResponse.cookies.delete('access_token');
    
    return errorResponse;
  }
}