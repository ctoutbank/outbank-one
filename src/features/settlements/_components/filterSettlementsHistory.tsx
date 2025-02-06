"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, FilterIcon, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Status =
  | "pending"
  | "pre-approved"
  | "approved"
  | "processing"
  | "error"
  | "settled";

export default function FiltersHistory({statusIn, dateFromIn, dateToIn} : { statusIn: string, dateFromIn: Date | undefined, dateToIn: Date | undefined}) {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>(statusIn ? statusIn.split(",") as Status[] : []);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(dateFromIn);
  const [dateTo, setDateTo] = useState<Date | undefined>(dateToIn);

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || "");

  const statuses = [
    {
      value: "pending",
      label: "Pendente",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      value: "pre-approved",
      label: "Pré Aprovado",
      color: "bg-sky-500 hover:bg-sky-600",
    },
    {
      value: "approved",
      label: "Aprovado",
      color: "bg-blue-700 hover:bg-blue-800",
    },
    {
      value: "processing",
      label: "Processando",
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    { value: "error", label: "Erro", color: "bg-red-500 hover:bg-red-600" },
    {
      value: "settled",
      label: "Liquidado",
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

  const handleFilter = () => {
    if (selectedStatuses.length > 0) {
      params.set("status", selectedStatuses.join(","));
    } else {
      params.delete("status");
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

    params.set("page", "1"); // Reset pagination
    router.push(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSelectedStatuses([]);
    setDateFrom(undefined);
    setDateTo(undefined);
    params.delete("status");
    params.delete("dateFrom");
    params.delete("dateTo");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };
  const activeFiltersCount =
    selectedStatuses.length + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0);
  return (
    <div className="w-full max-w-3xl space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            className="flex items-center gap-2"
          >
            <FilterIcon className="h-4 w-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </Button>
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="text-sm text-muted-foreground"
          >
            Limpar Filtros
          </Button>
        )}
      </div>

      {isFiltersVisible && (
        <div className="bg-background border rounded-lg p-4 space-y-4 shadow-md">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Status</h3>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Badge
                  key={status.value}
                  variant="secondary"
                  className={cn(
                    "cursor-pointer w-28 h-8 select-none",
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

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Intervalo de Datas</h3>
            <div className="flex flex-wrap gap-2">
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
                    {dateFrom ? format(dateFrom, "PPP") : "Data Inicial"}
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
                    {dateTo ? format(dateTo, "PPP") : "Data Final"}
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
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                onClick={handleFilter}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Filtrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
