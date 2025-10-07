import { NextResponse, NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"


export async  function middleware(request: NextRequest) {
    const token = await getToken({req:request})

    if(token && (
        // request.nextUrl.pathname === "/" ||
        request.nextUrl.pathname.startsWith("/sign-in") ||
        request.nextUrl.pathname.startsWith("/sign-up") ||
        request.nextUrl.pathname.startsWith("/verify") 
    ))
    {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    if(!token && (
        request.nextUrl.pathname.startsWith("/dashboard")

    ))
    {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

}
 
export const config = {
  matcher:[ 
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
  ]
}