"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Search, X } from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";

type Status =
  | "pending"
  | "pre-approved"
  | "approved"
  | "processing"
  | "error"
  | "settled";

export default function FiltersHistory() {
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams || "");

  const statuses = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      value: "pre-approved",
      label: "Pre-Approved",
      color: "bg-sky-500 hover:bg-sky-600",
    },
    {
      value: "approved",
      label: "Approved",
      color: "bg-blue-700 hover:bg-blue-800",
    },
    {
      value: "processing",
      label: "Processing",
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    { value: "error", label: "Error", color: "bg-red-500 hover:bg-red-600" },
    {
      value: "settled",
      label: "Settled",
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
  ];

  const toggleStatus = (status: Status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const clearAllFilters = () => {
    setSelectedStatuses([]);
    setDateFrom(undefined);
    setDateTo(undefined);
    params.delete("statuses");
    params.delete("dateFrom");
    params.delete("dateTo");
    router.push(`?${params.toString()}`);
  };

  const handleFilter = () => {
    if (selectedStatuses.length > 0) {
      params.set("statuses", selectedStatuses.join(","));
    } else {
      params.delete("statuses");
    }

    if (dateFrom) {
      params.set("dateFrom", dateFrom.toISOString());
    } else {
      params.delete("dateFrom");
    }

    if (dateTo) {
      params.set("dateTo", dateTo.toISOString());
    } else {
      params.delete("dateTo");
    }

    router.push(`?${params.toString()}`);
  };

  const activeFiltersCount =
    selectedStatuses.length + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0);

  return (
    <div className="w-full max-w-4xl space-y-6 p-6 bg-background border rounded-lg shadow-md">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Status</h3>
        <div className="flex flex-wrap gap-3">
          {statuses.map((status) => (
            <Badge
              key={status.value}
              variant="secondary"
              className={cn(
                "cursor-pointer text-sm py-2 px-3",
                selectedStatuses.includes(status.value as Status)
                  ? status.color
                  : "bg-secondary",
                selectedStatuses.includes(status.value as Status)
                  ? "text-white"
                  : "text-secondary-foreground"
              )}
              onClick={() => toggleStatus(status.value as Status)}
            >
              {status.label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Intervalo de Data</h3>
        <div className="flex flex-wrap gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !dateFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "PPP") : "De"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !dateTo && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "PPP") : "Até"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex gap-4">
          <Button onClick={handleFilter} className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Filtrar
          </Button>
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="text-sm py-1 px-2">
            {activeFiltersCount}{" "}
            {activeFiltersCount === 1 ? "filtro" : "filtros"} aplicados
          </Badge>
        )}
      </div>
    </div>
  );
}
