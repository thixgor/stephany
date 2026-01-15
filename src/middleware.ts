import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

const { auth } = NextAuth(authConfig);

export async function middleware(request: NextRequest) {
    const session = await auth();
    const { pathname } = request.nextUrl;

    // Security headers
    const response = NextResponse.next();

    // OWASP Security Headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // CSP Header
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https: blob:; " +
        "connect-src 'self' https:; " +
        "frame-ancestors 'none';"
    );

    // Protected routes
    const protectedRoutes = ['/dashboard', '/admin', '/cliente'];
    const adminRoutes = ['/admin'];
    const authRoutes = ['/login', '/register'];

    // Check if accessing protected route
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // Redirect authenticated users away from auth pages
    if (session && isAuthRoute) {
        const redirectUrl = session.user.role === 'admin' ? '/admin' : '/cliente';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // Redirect unauthenticated users to login
    if (!session && isProtectedRoute) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Check admin access
    if (session && isAdminRoute && session.user.role !== 'admin') {
        return NextResponse.redirect(new URL('/cliente', request.url));
    }

    // Handle /dashboard redirect
    if (pathname === '/dashboard') {
        if (session) {
            const redirectUrl = session.user.role === 'admin' ? '/admin' : '/cliente';
            return NextResponse.redirect(new URL(redirectUrl, request.url));
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return response;
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
};
