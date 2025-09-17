import { getThemeByTenant } from "@/lib/getThemeByTenant";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { Toaster } from "sonner";
import "./globals.css";
import {TooltipProvider} from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Determine the current host and extract the subdomain if present.  If the host
  // contains three or more parts (e.g. `tenant.example.com`), treat the first
  // segment as the tenant slug.  Otherwise, leave `subdomain` undefined so
  // that the application will use the default theme.
  const host = headers().get("host") || "";
  const parts = host.split(".");
  const subdomain = parts.length >= 3 ? parts[0] : undefined;

  let themeData;
  // Only attempt to resolve a tenant theme if a subdomain was detected.  For
  // apex domains like `outbank.cloud` or common subdomains like `www`, skip
  // the lookup so the app can render with its default colours instead of
  // showing the 404 page.
  if (subdomain) {
    themeData = await getThemeByTenant(subdomain);
  }

  // Fallback theme values when no tenant-specific colours exist
  const primary = themeData?.primary ?? "0 84% 60%";
  const secondary = themeData?.secondary ?? "0 0% 10%";

  const theme = {
    "--primary": primary,
    "--primary-foreground": secondary,
    "--sidebar-primary": primary,
  };

  return (
    <ClerkProvider>
      <html lang="pt-BR" suppressHydrationWarning>
        <head />
        <body className={inter.className} style={theme as React.CSSProperties}>
          <TooltipProvider>
            {children}
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
