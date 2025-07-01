import { NotFoundLayout } from "@/components/layout/not-found-layout";
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
  const host = headers().get("host") || "";
  const subdomain = host.split(".")[0];

  // Lógica de subdomínio inválido
  const themeData = await getThemeByTenant(subdomain);

  if (!themeData) {
    return (
      <html lang="pt-BR">
        <body>
          <NotFoundLayout />
        </body>
      </html>
    );
    
  }

  const primary = themeData.primary ?? "0 84% 60%";
  const secondary = themeData.secondary ?? "0 0% 10%";

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
