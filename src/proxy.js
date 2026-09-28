import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

const protectedRoutes = ['/dashboard', '/jadwal', '/booking', '/lapangan', '/user', '/report']

export async function proxy(request) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))

  if (isProtectedRoute) {
    const session = await getSession()
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect root to dashboard if logged in, otherwise to login
  if (path === '/') {
    const session = await getSession()
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
