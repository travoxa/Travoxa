import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths - Allow access without token
  if (
    pathname === "/" ||
    pathname === "/tour" ||
    pathname.startsWith("/tour/") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/") || // Let APIs handle their own auth or be public
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/travoxa-discovery") ||
    pathname.startsWith("/backpackers") || // Public backpackers page? Or at least landing
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/gallery") ||
    pathname.startsWith("/team") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/help") ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/vendor/login") || // Allow vendor login
    // Comprehensive static asset check (images, fonts, media, documents)
    pathname.match(/\.(png|jpg|jpeg|webp|gif|svg|ico|bmp|tiff|css|js|woff|woff2|ttf|otf|eot|mp4|webm|pdf|json|xml|txt)$/i)
  ) {
    return NextResponse.next();
  }

  // Check if user is authenticated for protected routes
  const sessionToken = request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    // Redirect to login if not authenticated
    // If they were trying to go to a vendor route, redirect to vendor login
    if (pathname.startsWith("/vendor")) {
      return NextResponse.redirect(new URL("/vendor/login", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // NOTE: Role-based authorization for /admin and /vendor is handled
  // inside the layout.tsx and page.tsx components themselves because
  // reading the decrypted JWT token role in Edge middleware requires
  // the 'next-auth/jwt' NextAuth secret which can be complex here.
  // We rely on the components to kick out unauthorized users.

  return NextResponse.next();
}

export const config = {
  // Optimized matcher to exclude known static paths and files
  // Excludes: api, _next, favicon.ico, fonts, public folder structure hints
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - fonts (public/fonts)
     * - destinations (public/Destinations)
     * - animations (public/animations)
     * - showcase (public/showcase)
     * - home (public/home)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|fonts|Destinations|animations|showcase|home).*)",
  ],
};
