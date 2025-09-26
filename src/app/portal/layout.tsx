import IdleLogout from "@/components/IdleLogout";
import { AppSidebar } from "@/components/layout/portal/AppSidebar";

import { SidebarProvider } from "@/hooks/use-sidebar-context";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <IdleLogout />
        <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
