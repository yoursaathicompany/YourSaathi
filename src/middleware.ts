import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default auth((req) => {
  const { nextUrl, auth: session } = req as any;
  const pathname = nextUrl.pathname;

  // ── Admin route protection ────────────────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    // Not logged in at all → redirect to login
    if (!session?.user) {
      const loginUrl = new URL('/login', nextUrl.origin);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Logged in but NOT admin → redirect to home with a 403 flag
    const role = (session.user as any)?.role;
    if (role !== 'admin') {
      const homeUrl = new URL('/?error=unauthorized', nextUrl.origin);
      return NextResponse.redirect(homeUrl);
    }
  }

  // ── Protected user routes (must be logged in) ─────────────────────────────
  if (pathname.startsWith('/redeem') || pathname.startsWith('/profile') || pathname.startsWith('/settings')) {
    if (!session?.user) {
      const loginUrl = new URL('/login', nextUrl.origin);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  // Match all routes except static files, images, sitemaps, and Next.js internals
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html|txt|xml)$).*)',
  ],
};
