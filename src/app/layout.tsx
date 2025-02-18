import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "Outbank One",
  description: "Soluções de Pagamento de Próxima Geração",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pt-BR" suppressHydrationWarning>
        <head />

        <body className="">{children}</body>
      </html>
    </ClerkProvider>
  );
}
