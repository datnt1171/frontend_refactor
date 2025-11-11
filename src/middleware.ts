import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';
import { authPaths, hasPermission } from '@/config/permissions';
import { getDefaultRoute, DEFAULT_ROUTE } from '@/config/defaultRoute';

const intlMiddleware = createMiddleware(routing);

// Constants
const PUBLIC_PATHS = ['/login'];
const DEFAULT_REDIRECT_PATH = '/task-management/processes';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle intl middleware first
  const intlResponse = intlMiddleware(request);
  
  // If intl middleware returned a redirect, return it immediately
  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse;
  }

  // Extract locale and path without locale
  const segments = pathname.split('/');
  const potentialLocale = segments[1];

  // Early return if not a valid locale
  if (!routing.locales.includes(potentialLocale as any)) {
    return intlResponse;
  }

  const locale = potentialLocale;
  const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}(/|$)`), '/');
  
  // Get auth tokens and user info
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const accessToken = request.cookies.get('access_token')?.value;
  const userRole = request.cookies.get('role')?.value;
  const userDept = request.cookies.get('department')?.value;

  // Check if current path is public
  const isPublicPath = PUBLIC_PATHS.includes(pathWithoutLocale);
  const isAuthPath = authPaths.some(path => pathWithoutLocale.startsWith(path));

  // Handle authenticated users accessing public paths
  if (refreshToken && isPublicPath) {
    // Redirect to their default route based on role + department
    const defaultRoute = userRole && userDept 
      ? getDefaultRoute(userDept, userRole)
      : DEFAULT_ROUTE;
    
    return NextResponse.redirect(new URL(`/${locale}${defaultRoute}`, request.url));
  }

  // Skip auth checks for public paths
  if (isPublicPath) {
    return intlResponse;
  }

  // Redirect to login if no refresh token
  if (!refreshToken) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Handle permission checks for protected paths (non-auth paths)
  if (!isAuthPath) {
    if (!userRole || !userDept) {
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, request.url));
    }
    
    if (!hasPermission(userRole, userDept, pathWithoutLocale)) {
      return NextResponse.redirect(new URL(`/${locale}/unauthorized`, request.url));
    }
  }

  // Handle access token refresh
  if (!accessToken) {
    try {
      const refreshResponse = await fetch(new URL(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, request.url), {
        method: 'POST',
        headers: {
          'Cookie': request.headers.get('cookie') || '',
          'Content-Type': 'application/json'
        }
      });

      if (refreshResponse.ok) {
        // Create redirect response with new cookies
        const redirectResponse = NextResponse.redirect(request.url);
        
        // Forward all Set-Cookie headers from refresh response
        const setCookieHeaders = refreshResponse.headers.getSetCookie?.() || 
                                refreshResponse.headers.get('set-cookie')?.split(', ') || [];
        
        setCookieHeaders.forEach(cookie => {
          redirectResponse.headers.append('Set-Cookie', cookie);
        });

        return redirectResponse;
      } else {
        // Clear invalid tokens and redirect to login
        const loginResponse = NextResponse.redirect(new URL(`/${locale}/login`, request.url));
        loginResponse.cookies.delete('refresh_token');
        loginResponse.cookies.delete('access_token');
        loginResponse.cookies.delete('role');
        loginResponse.cookies.delete('department');
        return loginResponse;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear tokens and redirect to login on network error
      const loginResponse = NextResponse.redirect(new URL(`/${locale}/login`, request.url));
      loginResponse.cookies.delete('refresh_token');
      loginResponse.cookies.delete('access_token');
      loginResponse.cookies.delete('role');
      loginResponse.cookies.delete('department');
      return loginResponse;
    }
  }

  return intlResponse;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};