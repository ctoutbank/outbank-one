"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthorizedMenu } from "@/features/menu/actions";
import { useSidebar } from "@/hooks/use-sidebar-context";
import {
  Bolt,
  Calculator,
  Calendar,
  CalendarDays,
  CalendarFold,
  Check,
  ChevronDown,
  ChevronRight,
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
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuData {
  teams: {
    name: string;
    logo: string;
    plan: string;
  }[];
  navSections: MenuSection[];
}

export function AppSidebar() {
  const { isOpen } = useSidebar();
  const [menuData, setMenuData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>(
    {}
  );
  const pathname = usePathname();

  function toggleSubmenu(key: string) {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  useEffect(() => {
    async function loadMenu() {
      try {
        const data = await getAuthorizedMenu();

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
  const isActiveItem = (url: string) => {
    return pathname === url;
  };
  if (loading) {
    return (
      <div
        className={`${isOpen ? "w-72" : "w-16"} transition-all duration-300 border-r bg-sidebar`}
      >
        <div className="flex flex-col h-full">
          {/* Header skeleton */}
          <div className="flex h-16 items-center border-b px-4">
            <Skeleton className="h-6 w-6" />
            {isOpen && <Skeleton className="ml-2 h-4 w-24" />}
          </div>

          <Separator />

          {/* Menu skeleton */}
          <div className="flex-1 p-4 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4" />
                {isOpen && <Skeleton className="h-4 w-20" />}
              </div>
            ))}
          </div>

          {/* Footer skeleton */}
          {isOpen && (
            <div className="p-4">
              <Skeleton className="h-10 w-full" />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div
        className={`${isOpen ? "w-72" : "w-16"} transition-all duration-300 border-r bg-sidebar`}
      >
        <div className="flex flex-col h-full">
          <div className="flex h-16 items-center border-b px-4">
            <div
              className="bg-primary rounded-md p-2 h-10 w-10 bg-cover bg-center overflow-hidden"
              style={{
                backgroundImage: `url(${menuData?.teams[0]?.logo})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            >
              {/* Imagem de fundo aplicada via CSS */}
            </div>
            {isOpen && <span className="ml-2 font-semibold">Erro</span>}
          </div>
          <div className="p-4">
            <div className="text-destructive text-sm text-center">
              {error || "Failed to load menu"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${isOpen ? "w-72" : "w-16"} transition-all duration-300 border-r bg-sidebar`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex h-16 items-center border-b px-4">
          <div
            className={`flex items-center gap-2 ${!isOpen && "justify-center w-full"} ${isOpen && "justify-between w-full"}`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`bg-primary rounded-md p-2 bg-cover bg-no-repeat bg-center overflow-hidden ${isOpen && "h-10 w-10"} ${!isOpen && "h-6 w-6"}`}
                style={{
                  backgroundImage: `url(${menuData.teams[0]?.logo})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                {/* Imagem de fundo aplicada via CSS */}
              </div>
              {isOpen && (
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {menuData.teams[0]?.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {menuData.teams[0]?.plan}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Menu sections - renderização condicional */}
        <div className="flex-1 overflow-y-auto p-4">
          {isOpen ? (
            <div className="space-y-4">
              {menuData.navSections.map((section) => (
                <Collapsible key={section.title} defaultOpen>
                  <div className="space-y-2">
                    {isOpen && (
                      <CollapsibleTrigger className="flex w-full items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
                        {section.title}
                        <ChevronDown className="h-3 w-3 transition-transform duration-200 data-[state=open]:rotate-180" />
                      </CollapsibleTrigger>
                    )}

                    <CollapsibleContent className="space-y-1">
                      {section.items.map((item) => {
                        const IconComponent = item.icon as LucideIcon;
                        const hasSubItems =
                          Array.isArray(item.items) && item.items.length > 0;
                        const submenuKey = `${section.title}-${item.title}`;
                        if (hasSubItems) {
                          return (
                            <Collapsible
                              key={item.title}
                              open={!!openSubmenus[submenuKey]}
                              onOpenChange={() => toggleSubmenu(submenuKey)}
                            >
                              <CollapsibleTrigger
                                className={`flex items-center w-full gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${!isOpen && "justify-center"} ${isActiveItem(item.url) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}`}
                                asChild
                              >
                                <button
                                  type="button"
                                  title={!isOpen ? item.title : undefined}
                                >
                                  {IconComponent && (
                                    <IconComponent className="h-4 w-4" />
                                  )}
                                  {isOpen && (
                                    <span className="flex-1 text-left">
                                      {item.title}
                                    </span>
                                  )}
                                  <ChevronRight
                                    className={`h-4 w-4 transition-transform duration-200 ${openSubmenus[submenuKey] ? "rotate-90" : "rotate-0"}`}
                                  />
                                </button>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="pl-6 space-y-1">
                                {item.items?.map((subitem) => (
                                  <a
                                    key={subitem.title}
                                    href={subitem.url}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${!isOpen && "justify-center"} ${isActiveItem(subitem.url) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}`}
                                    title={!isOpen ? subitem.title : undefined}
                                  >
                                    {isOpen && <span>{subitem.title}</span>}
                                  </a>
                                ))}
                              </CollapsibleContent>
                            </Collapsible>
                          );
                        }
                        // Item sem subitens
                        return (
                          <a
                            key={item.title}
                            href={item.url}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${!isOpen && "justify-center"} ${isActiveItem(item.url) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}`}
                            title={!isOpen ? item.title : undefined}
                          >
                            {IconComponent && (
                              <IconComponent className="h-4 w-4" />
                            )}
                            {isOpen && <span>{item.title}</span>}
                          </a>
                        );
                      })}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          ) : (
            // Menu colapsado: mostrar todos os ícones (itens e subitens) em uma lista única
            <div className="flex flex-col items-center gap-4">
              {menuData.navSections.flatMap((section) =>
                section.items.flatMap((item) => {
                  const IconComponent = item.icon as LucideIcon;
                  const hasSubItems =
                    Array.isArray(item.items) && item.items.length > 0;
                  if (hasSubItems && item.items) {
                    // Renderiza o ícone do pai e dos subitens como não clicáveis
                    return [
                      <div
                        key={item.title}
                        className="flex items-center justify-center h-10 w-10 rounded-lg cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                        title={item.title}
                        tabIndex={-1}
                        aria-disabled="true"
                      >
                        {IconComponent && <IconComponent className="h-5 w-5" />}
                      </div>,
                    ];
                  }
                  // Item sem subitens: renderiza como link clicável
                  return (
                    <a
                      key={item.title}
                      href={item.url}
                      className={`flex items-center justify-center h-10 w-10 rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${isActiveItem(item.url) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}`}
                      title={item.title}
                    >
                      {IconComponent && <IconComponent className="h-5 w-5" />}
                    </a>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
