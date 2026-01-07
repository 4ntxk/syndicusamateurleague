import { NextResponse, type NextRequest } from 'next/server'

const locales = ['pl', 'en']
const defaultLocale = 'pl'
const publicFile = /\.(.*)$/

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    publicFile.test(pathname)
  ) {
    return NextResponse.next()
  }

  const pathnameParts = pathname.split('/')
  const locale = pathnameParts[1]

  if (!locales.includes(locale)) {
    const url = request.nextUrl.clone()
    url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
    const response = NextResponse.redirect(url)
    response.cookies.set('locale', defaultLocale)
    return response
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-locale', locale)
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.cookies.set('locale', locale)
  return response
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
