"use client";

import {ChevronRight, LucideIcon} from "lucide-react";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";

interface Item {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
        title: string;
        url: string;
        icon?: LucideIcon;
        isActive?: boolean;
    }[];
}

interface Props {
    items: Item[],
    textSize?: string
}

export function NavMain({items, }: Props) {
    const activeUrl = usePathname();
    return (
        <SidebarGroup className="p-1 text-sm">
            <SidebarMenu className="gap-0.5">
                {items.map((item) => {
                    // Verifica se qualquer submenu está ativo
                    const isAnySubItemActive = item.items?.some(
                        (subItem) => activeUrl === subItem.url
                    );

                    return (
                        <SidebarMenuItem key={item.title}>
                            {item.items ? (
                                <Collapsible
                                    defaultOpen={item.isActive || isAnySubItemActive}
                                    className="group/collapsible"
                                >
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            isActive={isAnySubItemActive}
                                            size="sm"
                                            className="h-5 lg:h-6 text-xs lg:text-xs py-0.5 px-1.5"
                                        >
                                            {item.icon && (
                                                <div
                                                    className="relative flex items-center justify-center w-4 h-4 lg:w-5 lg:h-5 rounded-sm bg-sidebar-accent/10 flex-shrink-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:inset-0 group-data-[collapsible=icon]:m-auto group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4 lg:group-data-[collapsible=icon]:w-5 lg:group-data-[collapsible=icon]:h-5">
                                                    <item.icon
                                                        className="size-3 lg:size-4 text-sidebar-foreground"
                                                        strokeWidth={2}
                                                    />
                                                </div>
                                            )}
                                            <span
                                                className="font-normal lg:font-medium text-[9px] lg:text-[9px] truncate group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                                            <ChevronRight
                                                className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden size-3"/>
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent
                                        className={cn(
                                            "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
                                            "overflow-hidden transition-all duration-300"
                                        )}
                                    >
                                        <SidebarMenuSub className="mx-2 px-1 py-0">
                                            {item.items.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={activeUrl == subItem.url}
                                                        size="sm"
                                                        className="h-2 lg:h-5 text-xs py-0 px-1"
                                                    >
                                                        <a href={subItem.url}>
                              <span className="text-xs truncate">
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
                                    size="sm"
                                    className="h-5 lg:h-6 text-[9px] lg:text-[9px] py-0.5 px-1.5"
                                >
                                    <a href={item.url}>
                                        {item.icon && (
                                            <div
                                                className="relative flex items-center justify-center w-2 h-2 lg:w-5 lg:h-5 rounded-sm bg-sidebar-accent/10 flex-shrink-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:inset-0 group-data-[collapsible=icon]:m-auto group-data-[collapsible=icon]:w-4 group-data-[collapsible=icon]:h-4 lg:group-data-[collapsible=icon]:w-5 lg:group-data-[collapsible=icon]:h-5">
                                                <item.icon
                                                    className="size-2 lg:size-3.5 text-sidebar-foreground"
                                                    strokeWidth={2}
                                                />
                                            </div>
                                        )}
                                        <span
                                            className="font-normal lg:font-medium truncate group-data-[collapsible=icon]:hidden">
                      {item.title}
                    </span>
                                    </a>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
