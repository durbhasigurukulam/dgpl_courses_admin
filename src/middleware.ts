import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const currentUserCookie = request.cookies.get('user');
  const connectSidCookie = request.cookies.get('connect.sid');

  const isLoggedIn = !!currentUserCookie && !!connectSidCookie;
  const { pathname } = request.nextUrl;

  // If user is logged in and tries to access login page, redirect to dashboard
  if (isLoggedIn && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is not logged in and tries to access a protected route (anything other than login), redirect to login
  if (!isLoggedIn && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
