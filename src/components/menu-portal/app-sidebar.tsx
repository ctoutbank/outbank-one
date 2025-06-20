"use client"

import { Bolt, Calculator, Calendar, CalendarDays, CalendarFold, Check, DollarSign, DollarSignIcon, File, FilePlus2, FileText, FolderOpen, HomeIcon, Landmark, Link,  type LucideIcon, PieChart, Receipt, Settings, User, ChevronDown } from 'lucide-react'
import { useEffect, useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { NavMain } from "@/components/menu-portal/nav-projects"
import { TeamSwitcher } from "@/components/team-switcher"
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
import { NotificationIcon } from "@/components/notification"
import { getAuthorizedMenu } from "@/features/menu/actions"

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
            <div className="p-2 text-center text-destructive text-[9px]">{error || "Failed to load menu"}</div>
          </SidebarContent>
        </Sidebar>
    )
  }

  return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader className="flex flex-col items-center space-y-0 p-0">
          <div className="w-full scale-[0.5] origin-center flex justify-between items-center -my-2">
            <TeamSwitcher teams={menuData.teams} />
            <NotificationIcon/>
          </div>
          <Separator orientation="horizontal" className="bg-border w-full" />
        </SidebarHeader>

        <SidebarContent className="flex flex-col h-full max-h-[calc(100vh-3rem)] overflow-y-auto p-0 space-y-0">
          <div className="flex-1 min-h-0 space-y-0">
            {menuData.navSections.map((section, index) => (
                <Collapsible key={section.title} defaultOpen className="group/collapsible">
                  <SidebarGroup className="space-y-0 py-0">
                    <SidebarGroupLabel asChild className="h-4 pt-2">
                      <CollapsibleTrigger
                          className="flex w-full items-center justify-between text-[9px] font-semibold text-muted-foreground uppercase tracking-tighter px-0 py-0 pb-2 pt-2 hover:bg-muted hover:text-foreground rounded-sm transition-colors h-4"
                      >
                        {section.title}
                        <ChevronDown className="ml-auto h-2 w-2 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                      </CollapsibleTrigger>
                    </SidebarGroupLabel>

                    <CollapsibleContent>
                      <SidebarGroupContent>
                        <SidebarMenu className="space-y-2">
                          <NavMain items={section.items}/>
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </CollapsibleContent>
                  </SidebarGroup>

                  {index < menuData.navSections.length - 1 && (
                      <Separator className="bg-border/50 my-0" />
                  )}
                </Collapsible>
            ))}
          </div>
        </SidebarContent>

        <SidebarFooter className="p-0 -mt-1">
          <div className="scale-[0.6] origin-center -my-2">
            <UserMenu />
          </div>
        </SidebarFooter>
      </Sidebar>
  )
}