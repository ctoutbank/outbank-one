"use client"

import { type LucideIcon, ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useSidebar } from "@/components/ui/sidebar"
import type React from "react";

interface Item {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
    }[]
}

interface Props {
    items: Item[]
    textSize?: string
}

export function NavMain({ items }: Props) {
    const activeUrl = usePathname()
    const { state } = useSidebar()
    const isCollapsed = state === "collapsed"

    return (
        <SidebarGroup className="p-1 text-sm" data-collapsible={isCollapsed ? "icon" : "default"}>
            <SidebarMenu className="gap-0.5">
                {items.map((item) => {
                    const isAnySubItemActive = item.items?.some((subItem) => activeUrl === subItem.url)

                    return (
                        <SidebarMenuItem key={item.title}>
                            {item.items ? (
                                <Collapsible defaultOpen={item.isActive || isAnySubItemActive} className="group/collapsible">
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            isActive={isAnySubItemActive}
                                            size="xs"
                                            className={cn(
                                                "w-full flex items-center",
                                                !isCollapsed && "pl-0 -ml-4 justify-start",
                                                isCollapsed && "justify-center px-0",

                                            )}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-2 flex-1">
                                                    {item.icon && (
                                                        <div
                                                            className={cn(
                                                                "flex items-center justify-center w-4 h-4 lg:w-5 lg:h-5 rounded-sm bg-sidebar-accent/10 flex-shrink-0",
                                                                isCollapsed && "w-5 h-5 mx-auto",
                                                            )}
                                                        >
                                                            <item.icon className="size-3 text-black" strokeWidth={2} />
                                                        </div>
                                                    )}
                                                    <span className="text-[10px] truncate group-data-[collapsible=icon]:hidden font-medium">
                            {item.title}
                          </span>
                                                </div>
                                                <ChevronDown className="text-black h-3 w-3 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180 mr-[-2px] group-data-[collapsible=icon]:hidden " />

                                            </div>
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent
                                        className={cn(
                                            "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
                                            "overflow-hidden transition-all duration-300",
                                        )}
                                    >
                                        <SidebarMenuSub className="mx-2 px-1 py-0 space-y-0">
                                            {item.items.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title} className="py-0">
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={activeUrl == subItem.url}
                                                        size="xs"
                                                        className="-ml-3 font-dmSans px-2 py-1 h-auto min-h-0 w-full"
                                                    >
                                                        <a href={subItem.url} className="flex items-center w-full overflow-hidden">
                              <span className="font-dmSans text-[9px] truncate text-black flex-1 min-w-0">
                                {subItem.title}
                              </span>
                                                        </a>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </Collapsible>
                            ) : (
                                <SidebarMenuButton
                                    asChild
                                    isActive={item.url === activeUrl || item.isActive}
                                    size="xs"
                                    className={cn(
                                        "w-full",
                                        !isCollapsed && "justify-start pl-0 -ml-4",
                                        isCollapsed && "justify-center px-0",
                                    )}
                                >
                                    <a href={item.url} className="flex items-center gap-2 w-full overflow-hidden">
                                        {item.icon && (
                                            <div
                                                className={cn(
                                                    "flex items-center justify-center w-4 h-4 lg:w-5 lg:h-5 rounded-sm bg-sidebar-accent/10 flex-shrink-0",
                                                    isCollapsed && "w-5 h-5 mx-auto",
                                                )}
                                            >
                                                <item.icon className="size-3 text-black" strokeWidth={2} />
                                            </div>
                                        )}
                                        <span className="font-medium truncate group-data-[collapsible=icon]:hidden flex-1 min-w-0 text-[10px] text-black">
                      {item.title}
                    </span>
                                    </a>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
