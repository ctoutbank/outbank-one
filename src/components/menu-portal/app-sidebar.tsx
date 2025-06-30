"use client"

import type React from "react"

import { NavMain } from "@/components/menu-portal/nav-projects"
import { NotificationIcon } from "@/components/notification"
import { TeamSwitcher } from "@/components/team-switcher"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar"
import { UserMenu } from "@/components/user-menu"
import { getAuthorizedMenu } from "@/features/menu/actions"
import {
  Bolt,
  Calculator,
  Calendar,
  CalendarDays,
  CalendarFold,
  Check,
  ChevronDown,
  DollarSign,
  DollarSignIcon,
  File,
  FilePlus2,
  FileText,
  FolderOpen,
  HomeIcon,
  Landmark,
  Link,
  type LucideIcon,
  PieChart,
  Receipt,
  Settings,
  User,
} from "lucide-react"
import { useEffect, useState } from "react"

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
}

interface MenuItem {
  title: string
  url: string
  icon?: LucideIcon
  items?: {
    title: string
    url: string
  }[]
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

interface MenuData {
  teams: {
    name: string
    logo: string
    plan: string
  }[]
  navSections: MenuSection[]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [menuData, setMenuData] = useState<MenuData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadMenu() {
      try {
        const data = await getAuthorizedMenu()

        const transformedData = {
          teams: data.teams.map((team: any) => ({
            ...team,
            logoUrl: team.logo || HomeIcon,
          })),
          navSections: data.navSections.map((section: any) => ({
            ...section,
            items: section.items.map((item: any) => ({
              ...item,
              icon: item.icon ? iconMap[item.icon] : undefined,
            })),
          })),
        }

        setMenuData(transformedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    loadMenu()
  }, [])

  if (loading) {
    return (
        <Sidebar collapsible="icon" {...props}>
          <SidebarHeader>
            <div className="h-8 w-full animate-pulse bg-muted rounded-md" />
          </SidebarHeader>
          <SidebarContent>
            {Array.from({ length: 5 }).map((_, i) => (
                <SidebarMenuSkeleton key={i} showIcon />
            ))}
          </SidebarContent>
          <SidebarFooter>
            <div className="h-8 w-full animate-pulse bg-muted rounded-md" />
          </SidebarFooter>
        </Sidebar>
    )
  }

  if (error || !menuData) {
    return (
        <Sidebar collapsible="icon" {...props}>
          <SidebarContent>
            <div className="p-2 text-center text-destructive text-[6px]">{error || "Failed to load menu"}</div>
          </SidebarContent>
        </Sidebar>
    )
  }

  return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="flex flex-col items-center space-y-0 p-2 group-data-[collapsible=icon]:p-1">
          {/* Container adaptativo para o header */}
          <div className="w-full flex justify-between items-center transition-all duration-200 ease-in-out group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:gap-1">
            {/* TeamSwitcher - quando expandido mostra normal, quando colapsado fica menor */}
            <div className="flex-1 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:scale-75 group-data-[collapsible=icon]:origin-center">
              <TeamSwitcher teams={menuData.teams} />
            </div>

            {/* NotificationIcon - sempre visível */}
            <div className="group-data-[collapsible=icon]:scale-90">
              <NotificationIcon />
            </div>
          </div>

          <Separator orientation="horizontal" className="bg-border w-full mt-2 group-data-[collapsible=icon]:mt-1" />
        </SidebarHeader>

        <SidebarContent className="flex flex-col h-full max-h-[calc(100vh-3rem)] p-0 space-y-0">
          <div className="flex-1 min-h-0 space-y-0">
            {menuData.navSections.map((section) => (
                <Collapsible key={section.title} defaultOpen className="group/collapsible">
                  <SidebarGroup className="space-y-0.5 py-0.5">
                    <SidebarGroupLabel asChild className="h-4 pt-2">
                      <CollapsibleTrigger className="flex w-full items-center justify-between -ml-4 font-semibold text-muted-foreground uppercase tracking-tighter px-0 py-0 pb-2 pt-2 hover:bg-muted hover:text-foreground rounded-sm transition-colors h-4">
                        {section.title}
                        <ChevronDown className="text-black ml-auto h-2 w-2 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                      </CollapsibleTrigger>
                    </SidebarGroupLabel>

                    <CollapsibleContent>
                      <SidebarGroupContent>
                        <SidebarMenu className="space-y-4 ml-0">
                          <NavMain items={section.items} />
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </CollapsibleContent>
                  </SidebarGroup>
                </Collapsible>
            ))}
          </div>
        </SidebarContent>

        <SidebarFooter className="p-0 mt-auto group-data-[collapsible=icon]:p-0 scale-[0.6]">
          {/* Container adaptativo para o UserMenu */}
          <div className="w-full flex items-center justify-center transition-all duration-200 ease-in-out group-data-[collapsible=icon]:scale-[0.35] group-data-[collapsible=icon]:hidden">
            <UserMenu />
          </div>
        </SidebarFooter>
      </Sidebar>
  )
}
