import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define paths that are public (don't require authentication)
const publicPaths = ['/auth/login', '/auth/register', '/']

export function middleware(request: NextRequest) {
  // Get the path from the request URL
  const path = request.nextUrl.pathname
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(publicPath => path.startsWith(publicPath))
  
  // Get auth token from cookies
  const token = request.cookies.get('auth-token')?.value
  
  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicPath) {
    // Create a URL to redirect to
    const loginUrl = new URL('/auth/login', request.url)
    // Add the current path as redirect parameter
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }
  
  // If has token and trying to access login page, redirect to dashboard
  if (token && path === '/auth/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // Otherwise, continue with the request
  return NextResponse.next()
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    // Apply middleware to all paths except for API routes and static files
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}