"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BarChart3 } from "lucide-react";

interface TaxasDashboardButtonProps {
  children: React.ReactNode;
}

export function TaxasDashboardButton({ children }: TaxasDashboardButtonProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BarChart3 className="h-4 w-4" />
          Dashboard
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-96">{children}</PopoverContent>
    </Popover>
  );
}
