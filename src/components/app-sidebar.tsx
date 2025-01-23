"use client";

import {
  Building,
  Calculator,
  ChartArea,
  DollarSign,
  DollarSignIcon,
  Grid,
  HomeIcon,
  Landmark,
  User,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-projects";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import build from "next/dist/build";
import { usePathname } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const activeUrl = usePathname();
  const data = {
    teams: [
      {
        name: "Banco Prisma",
        logo: DollarSignIcon,
        plan: "Empresarial",
      },
    ],
    navMain: [
      {
        title: "Dashboard Geral",
        url: "/portal/dashboard",
        icon: ChartArea,
      },
      {
        title: "Vendas",
        url: "/portal/transactions",
        icon: DollarSign,
      },
      {
        title: "Estabelecimentos",
        url: "/portal/merchants",
        icon: HomeIcon,
      },
      {
        title: "Terminais",
        url: "/portal/terminals",
        icon: Calculator,
      },
      {
        title: "Consultores",
        url: "/portal/salesAgents",
        icon: User,
      },
      {
        title: "Natureza Jurídica",
        url: "/portal/legalNatures",
        icon: Building,
      },
      {
        title: "Categorias",
        url: "/portal/categories",
        icon: Grid,
      },

      {
        title: "Liquidação",
        url: "",
        icon: Landmark,
        items: [
          {
            title: "Hoje",
            url: "/portal/settlements",
          },
          {
            title: "Histórico",
            url: "/portal/settlements/history",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <UserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
