import { NextRequest, NextResponse } from 'next/server';

const protectedPaths = [
  '/dashboard',
  '/workspaces',
  '/projects',
  '/calendar',
  '/reports',
  '/search',
  '/notifications',
  '/profile',
  '/team',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('tfp_token')?.value;

  // Check if the path is protected
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from auth pages
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/workspaces/:path*',
    '/projects/:path*',
    '/calendar/:path*',
    '/reports/:path*',
    '/search/:path*',
    '/notifications/:path*',
    '/profile/:path*',
    '/team/:path*',
    '/login',
    '/register',
  ],
};
