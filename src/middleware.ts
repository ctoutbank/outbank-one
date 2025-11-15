import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define as rotas públicas que não exigem autenticação
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/banking",
  "/cards",
  "/acquiring",
  "/auth/sign-in",
  "/api/export-pdf",
  "/api/cron/send-transaction-report",
  "/api/hello",
  "/api/cron/report-execution",
  "/api/cron/report-schedule",
  "/api/cron/sync-transactions",
  "/api/cron/sync-terminals",
  "/api/export-excel",
  "/api/cron(.*)",
  "/api/check-user",
  "/api/login-db",
  "/api/disable-first-login",
  "/api/contact-form",
  "/password-create",
]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const hostname = request.nextUrl.hostname;
  const pathname = request.nextUrl.pathname;

  // Pega subdomínio, ex: tenant2.lvh.me → tenant2
  const parts = hostname.split(".");
  const subdomain = parts.length >= 3 ? parts[0] : null;
  const isTenantHost = subdomain && !["www", "lvh", "localhost"].includes(subdomain);

  if (isTenantHost) {
    const { userId } = await auth();
    
    const marketingRoutes = ["/", "/banking", "/acquiring", "/cards"];
    
    if (marketingRoutes.includes(pathname)) {
      if (userId) {
        const portalUrl = new URL("/portal", request.url);
        return NextResponse.redirect(portalUrl);
      }
      const signInUrl = new URL("/auth/sign-in", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  const response = NextResponse.next();

  // Define cookie "tenant" se tiver subdomínio válido
  if (isTenantHost) {
    response.cookies.set("tenant", subdomain, {
      path: "/",
      httpOnly: false,
    });
  }

  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
