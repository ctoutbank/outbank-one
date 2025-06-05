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
    logo: LucideIcon;
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
            logo: iconMap[team.logo] || DollarSignIcon,
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
      <SidebarHeader className="flex flex-col items-center">
        <TeamSwitcher teams={menuData.teams} />
        <Separator orientation="horizontal" className="bg-[#d2d2d2]" />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuData.navMain} />
        {/* <a
          href="https://outbank-chart-ia.vercel.app/"
          target="_blank"
          className="flex items-center gap-2 p-4"
        >
          <ChartBar className="h-4 w-4" />
          <p>Acessar IA de Gráficos</p>
        </a>*/}
      </SidebarContent>
      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
