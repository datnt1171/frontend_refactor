import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

// Create the base next-intl middleware
const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Run the next-intl middleware first to handle locale redirects (e.g., / → /en)
  const response = intlMiddleware(request);

  // Extract the potential locale from the pathname (e.g., "/en/login" → "en")
  const segments = pathname.split('/');
  const potentialLocale = segments[1];

  // Check if the pathname starts with a valid locale
  if (routing.locales.includes(potentialLocale as 'en' | 'vi' | 'zh-hant')) {
    const locale = potentialLocale;

    // Calculate path without locale (e.g., "/en/login" → "/login")
    const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}(/|$)`), '/');

    const token = request.cookies.get('access_token')?.value;

    // Define public paths
    const isPublicPath = ['/', '/login'].includes(pathWithoutLocale);

    // Redirect if no token and accessing a protected route
    if (!token && !isPublicPath) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    // Redirect if token exists and accessing a public path
    if (token && isPublicPath) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
  }

  // Return the intlMiddleware response for all other cases
  return response;
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};