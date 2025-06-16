"use client";

import {
  Bolt,
  Calculator,
  Calendar,
  CalendarDays,
  CalendarFold,
  Check,
  DollarSign,
  DollarSignIcon,
  File,
  FilePlus2,
  FileText,
  FolderOpen,
  HomeIcon,
  Landmark,
  Link,
  LucideIcon,
  PieChart,
  Receipt,
  Settings,
  User,
} from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";

import { NavMain } from "@/components/menu-portal/nav-projects";
import { TeamSwitcher } from "@/components/team-switcher";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { UserMenu } from "@/components/user-menu";
import { getAuthorizedMenu } from "@/features/menu/actions";
import { NotificationIcon } from "@/components/notification";

// Icon mapping
const iconMap: { [key: string]: LucideIcon } = {
  Calculator,
  DollarSign,
  DollarSignIcon,
  HomeIcon,
  Landmark,
  User,
  Settings,
  Check,
  Link,
  PieChart,
  Bolt,
  File,
  FileText,
  Calendar,
  FolderOpen,
  CalendarDays,
  FilePlus2,
  Receipt,
  CalendarFold,
};

interface MenuItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: {
    title: string;
    url: string;
  }[];
}

interface MenuData {
  teams: {
    name: string;
    logo: string;
    plan: string;
  }[];
  navMain: MenuItem[];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMenu() {
      try {
        const data = await getAuthorizedMenu();

        // Transform the menu data to include actual icon components
        const transformedData = {
          teams: data.teams.map((team: any) => ({
            ...team,
            logoUrl: team.logo || HomeIcon,
          })),
          navMain: data.navMain.map((item: any) => ({
            ...item,
            icon: item.icon ? iconMap[item.icon] : undefined,
          })),
        };

        setMenuData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, []);

  if (loading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="h-10 w-full animate-pulse bg-muted rounded-md" />
        </SidebarHeader>
        <SidebarContent>
          {Array.from({ length: 5 }).map((_, i) => (
            <SidebarMenuSkeleton key={i} showIcon />
          ))}
        </SidebarContent>
        <SidebarFooter>
          <div className="h-10 w-full animate-pulse bg-muted rounded-md" />
        </SidebarFooter>
      </Sidebar>
    );
  }

  if (error || !menuData) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarContent>
          <div className="p-4 text-center text-destructive">
            {error || "Failed to load menu"}
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex flex-col items-center p-1 space-y-1">
        <div className="w-full scale-75 lg:scale-90 origin-center flex justify-between items-center">
          <TeamSwitcher teams={menuData.teams} />
          <NotificationIcon />
        </div>
        <Separator orientation="horizontal" className="bg-[#d2d2d2] w-full" />
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full max-h-[calc(100vh-7rem)] overflow-y-auto p-0">
        <div className="flex-1 min-h-0">
          <NavMain items={menuData.navMain} />
        </div>
      </SidebarContent>
      <SidebarFooter className="p-1">
        <div className="scale-75 lg:scale-90 origin-center">
          <UserMenu />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
