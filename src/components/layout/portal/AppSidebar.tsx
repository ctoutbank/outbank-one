"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAuthorizedMenu } from "@/features/menu/actions";
import { useSidebar } from "@/hooks/use-sidebar-context";
import { SignOutButton, useUser } from "@clerk/nextjs";
import {
  Bolt,
  Calculator,
  Calendar,
  CalendarDays,
  CalendarFold,
  Check,
  ChevronRight,
  DollarSign,
  DollarSignIcon,
  File,
  FileText,
  FolderOpen,
  HomeIcon,
  Landmark,
  Link,
  LogOut,
  type LucideIcon,
  PieChart,
  Receipt,
  Settings,
  User,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const iconMap: { [key: string]: LucideIcon } = {
  Calculator, DollarSign, DollarSignIcon, HomeIcon, Landmark, User,
  Settings, Check, Link, PieChart, Bolt, File, FileText, Calendar,
  FolderOpen, CalendarDays, Receipt, CalendarFold,
};

interface MenuItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: MenuItem[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuData {
  teams: { name: string; logo: string; plan: string }[];
  navSections: MenuSection[];
}

function SidebarSkeleton({ isOpen }: { isOpen: boolean }) {
  return (
    <div className={`transition-all duration-300 border-r bg-sidebar ${isOpen ? "w-72" : "w-20"}`}>
      <div className="flex flex-col h-full">
        <div className="flex h-16 items-center border-b px-6">
          <Skeleton className="h-8 w-8 rounded-full" />
          {isOpen && <Skeleton className="ml-4 h-6 w-32" />}
        </div>
        <div className="flex-1 p-4 space-y-6">
          {Array.from({ length: 2 }).map((_, sectionIndex) => (
            <div key={sectionIndex}>
              {isOpen && <Skeleton className="h-4 w-20 mb-4" />}
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-4 px-2">
                    <Skeleton className="h-6 w-6" />
                    {isOpen && <Skeleton className="h-5 w-40" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto border-t p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            {isOpen && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppSidebar() {
  const { isOpen } = useSidebar();
  const { user } = useUser();
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>({});
  const pathname = usePathname();

  useEffect(() => {
    async function loadMenu() {
      try {
        const data = await getAuthorizedMenu();
        const transformedData = {
          teams: data.teams.map((team: any) => ({
            ...team,
            name: team.name || "Portal",
          })),
          navSections: data.navSections.map((section: any) => ({
            ...section,
            items: section.items.map((item: any) => ({
              ...item,
              icon: item.icon ? iconMap[item.icon] : undefined,
              items: item.items?.map((subItem: any) => ({ ...subItem })),
            })),
          })),
        };
        setMenuData(transformedData);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  const isActive = (url: string) => pathname === url;

  if (loading) {
    return <SidebarSkeleton isOpen={isOpen} />;
  }

  const NavItem = ({ item }: { item: MenuItem }) => {
    const hasSubItems = Array.isArray(item.items) && item.items.length > 0;
    const submenuKey = item.title;
    const isSubmenuOpen = openSubmenus[submenuKey] || item.items?.some(sub => isActive(sub.url));

    if (hasSubItems) {
      return (
        <Collapsible open={isSubmenuOpen} onOpenChange={(open) => setOpenSubmenus(prev => ({ ...prev, [submenuKey]: open }))}>
          <CollapsibleTrigger asChild>
            <a
              className={`group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${isActive(item.url) ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80"}`}
            >
              <div className="flex items-center gap-3">
                {item.icon && <item.icon className="h-5 w-5" />}
                {isOpen && <span>{item.title}</span>}
              </div>
              {isOpen && <ChevronRight className={`h-4 w-4 transition-transform ${isSubmenuOpen ? 'rotate-90' : ''}`} />}
            </a>
          </CollapsibleTrigger>
          <CollapsibleContent className={`transition-all duration-300 ease-in-out ${isOpen ? 'pl-8' : 'pl-0'}`}>
            <div className="mt-1 space-y-1">
              {item.items?.map((subItem) => (
                <NavItem key={subItem.title} item={subItem} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={item.url}
              className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground relative ${isActive(item.url) ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80"} ${!isOpen && "justify-center"}`}
            >
              {isActive(item.url) && <div className="absolute left-0 h-6 w-1 bg-primary rounded-r-full" />}
              {item.icon && <item.icon className="h-5 w-5" />}
              {isOpen && <span>{item.title}</span>}
            </a>
          </TooltipTrigger>
          {!isOpen && (
            <TooltipContent side="right">
              {item.title}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className={`transition-all duration-300 border-r bg-sidebar text-sidebar-foreground ${isOpen ? "w-72" : "w-20"}`}>
      <div className="flex flex-col h-full">
        <div className="flex h-16 items-center border-b px-6 shrink-0">
          <a href="/portal/dashboard" className="flex items-center gap-3">
            <Image src={menuData?.teams[0]?.logo || '/logo.svg'} alt="Logo" width={32} height={32} />
            {isOpen && <span className="font-semibold text-lg">{menuData?.teams[0]?.name || "Portal"}</span>}
          </a>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto p-4">
          {menuData?.navSections.map((section) => (
            <div key={section.title}>
              {isOpen && (
                <h2 className="px-3 text-xs font-semibold uppercase text-sidebar-foreground/60 tracking-wider mb-2">
                  {section.title}
                </h2>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavItem key={item.title} item={item} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto border-t p-4">
          <SignOutButton>
            <div
              role="button"
              tabIndex={0}
              className="group flex cursor-pointer items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              {user && (
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
                  <AvatarFallback>{user.fullName?.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              {isOpen && (
                <div className="flex flex-col text-left">
                  <span className="font-medium">{user?.fullName}</span>
                  <span className="text-xs text-sidebar-foreground/60">
                    {user?.primaryEmailAddress?.emailAddress}
                  </span>
                </div>
              )}
              {isOpen && <LogOut className="ml-auto h-5 w-5" />}
            </div>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}