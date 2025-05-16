import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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
  "/password-create",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
