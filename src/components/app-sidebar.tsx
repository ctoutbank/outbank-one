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
  Settings,
  Check,
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
        title: "Vendas",
        url: "/portal/transactions",
        icon: DollarSign,
        items: [
          {
            title: "Dashboard",
            url: "/portal/dashboard",
          },
        ],
      },

      {
        title: "Consultores Comerciais",
        url: "/portal/salesAgents",
        icon: User,
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
      {
        title: "Agenda dos Lojistas",
        url: "/portal/merchantAgenda",
        icon: Check,
      },
      {
        title: "Recebimentos",
        url: "/portal/receipts",
        icon: Check,
      },
      {
        title: "Configurações",
        url: "/portal/categories",
        icon: Settings,
        items: [
          {
            title: "Categorias",
            url: "/portal/categories",
          },
          {
            title: "Natureza Jurídica",
            url: "/portal/legalNatures",
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
