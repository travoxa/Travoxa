import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and auth routes
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/auth/") ||
    pathname === "/" ||
    pathname.startsWith("/backpackers") ||
    pathname.startsWith("/tours") ||
    pathname.startsWith("/travoxa-ai") ||
    pathname.startsWith("/pages") ||
    pathname.startsWith("/contact")
  ) {
    return NextResponse.next();
  }

  // Check if user is authenticated for protected routes
  const sessionToken = request.cookies.get("next-auth.session-token")?.value || 
                       request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For authenticated users, we'll handle the onboarding check on the client side
  // This middleware just ensures they're authenticated
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|fonts|images|Destinations|.*\\.jpg$|.*\\.jpeg$|.*\\.png$|.*\\.svg$|login|onboarding).*)",
  ],
};
