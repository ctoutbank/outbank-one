import { ClerkProvider } from "@clerk/nextjs";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { getThemeByTenant } from "@/lib/getThemeByTenant";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    const host = headers().get("host") || "";
    const subdomain = host.split('.')[0];

    // Lógica de subdomínio inválido
    const themeData = await getThemeByTenant(subdomain);

    if (!themeData) {
        return (
            <html lang="pt-BR">
            <body>
            <div>Empresa não encontrada</div>
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
            {children}
            <Toaster richColors position="top-right" />
            </body>
            </html>
        </ClerkProvider>
    );
}
