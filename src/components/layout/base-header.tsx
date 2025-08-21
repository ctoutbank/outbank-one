"use client";

import { NotificationIcon } from "@/components/notification";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserMenu } from "@/components/user-menu";
import { useSidebar } from "@/hooks/use-sidebar-context";
import { PanelLeft } from "lucide-react";
import React from "react";

interface BaseHeaderProps {
  breadcrumbItems: { title: string; url?: string }[];
}

const BaseHeader = ({ breadcrumbItems }: BaseHeaderProps) => {
  const { toggle } = useSidebar();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 justify-between pt-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="h-7 w-7"
        >
          <PanelLeft className="h-4 w-4" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {item.url ? (
                    <BreadcrumbLink href={item.url}>
                      {item.title}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.title} </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2">
        <NotificationIcon />
        <UserMenu />
      </div>
    </header>
  );
};

export default BaseHeader;
