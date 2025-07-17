import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let intl middleware handle locale redirects first
  const response = intlMiddleware(request);
  
  // If intl middleware returned a redirect, return it immediately
  if (response.status === 307 || response.status === 308) {
    return response;
  }

  const segments = pathname.split('/');
  const potentialLocale = segments[1];

  if (routing.locales.includes(potentialLocale as 'en' | 'vi' | 'zh-hant')) {
    const locale = potentialLocale;
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}(/|$)`), '/');
    const refresh_token = request.cookies.get('refresh_token')?.value;

    // Only apply auth logic to specific paths, not the locale root
    if (pathWithoutLocale !== '/') {
      const isPublicPath = ['/login'].includes(pathWithoutLocale);

      if (!refresh_token && !isPublicPath) {
        return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
      }

      if (refresh_token && isPublicPath) {
        return NextResponse.redirect(new URL(`/${locale}/task-management/processes`, request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};