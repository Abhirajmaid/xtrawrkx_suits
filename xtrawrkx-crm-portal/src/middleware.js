import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Redirect old /sales/accounts URLs to new /clients/accounts URLs
  if (pathname.startsWith('/sales/accounts')) {
    const newPath = pathname.replace('/sales/accounts', '/clients/accounts')
    const url = request.nextUrl.clone()
    url.pathname = newPath
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - unauthorized (unauthorized page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|unauthorized).*)',
  ],
}

