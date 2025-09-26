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
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </SidebarProvider>
  );
}