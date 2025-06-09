import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isLoginPage = request.nextUrl.pathname === '/login'
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')
//   const isOnboardingListPage = request.nextUrl.pathname === '/dashboard/onboarding-list'

  // If trying to access login page while already authenticated
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If trying to access protected routes without authentication
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If authenticated user manually changes URL to any other route except onboarding-list
  // if (token && !isOnboardingListPage && !isLoginPage) {
  //   return NextResponse.redirect(new URL('/dashboard/onboarding-list', request.url))
  // }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*', '/login']
}