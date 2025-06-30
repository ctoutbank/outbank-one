import IdleLogout from "@/components/IdleLogout";
import { AppSidebar } from "@/components/menu-portal/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

import { SidebarProvider } from "@/components/ui/sidebar";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-card rounded-lg shadow overflow-x-hidden">
        <IdleLogout />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
