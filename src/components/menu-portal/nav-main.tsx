"use client";

import { ChevronRight, LucideIcon } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
                          items,
                        }: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  return (
      <SidebarGroup>
        <SidebarGroupLabel className="text-[6px] px-1 py-0 tracking-tight text-muted-foreground bg-blue-700">
          Menu
        </SidebarGroupLabel>

        <SidebarMenu className="space-y-[8px]">
          {items.map((item) => (
              <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
                <SidebarMenuItem>
                  <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className="h-5 text-[6px] px-1 py-[2px] gap-1"
                      size="sm"
                  >
                    <a href={item.url} className="flex items-center gap-1">
                      <item.icon className="h-3 w-3 shrink-0" />
                      <span className="truncate leading-none">{item.title}</span>
                    </a>
                  </SidebarMenuButton>

                  {item.items?.length ? (
                      <>
                        <CollapsibleTrigger asChild className="bg-blue-600">
                          <SidebarMenuAction className="data-[state=open]:rotate-90 h-5 w-4">
                            <ChevronRight className="h-2 w-2" />
                            <span className="sr-only bg-blue-600">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub className="ml-3 space-y-[1px] bg-blue-500">
                            {item.items.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                      asChild
                                      className="h-2 text-[6px] px-1 py-[2px]"
                                      size="xs"
                                  >
                                    <a href={subItem.url}>
                              <span className="truncate leading-none">
                                {subItem.title}
                              </span>
                                    </a>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroup>
  );
}
