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
import { useEffect, useRef, useState } from "react";

interface DashboardFiltersProps {
  dateRange: {
    from: string | undefined;
    to?: string | undefined;
  };
}

export default function DashboardFilters({ dateRange }: DashboardFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Valores padrão
  const defaultDateFrom = "2024-09-01T00:00:00";
  const defaultDateTo = format(new Date(), "yyyy-MM-dd'T'HH:mm");

  const dateFromParam = searchParams?.get("dateFrom") || defaultDateFrom;
  const dateToParam = searchParams?.get("dateTo") || defaultDateTo;

  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [dateFrom, setDateFrom] = useState(dateFromParam);
  const [dateTo, setDateTo] = useState(dateToParam);

  const filterRef = useRef<HTMLDivElement>(null);

  // Aplicar filtros automaticamente na primeira carga se não houver parâmetros na URL
  useEffect(() => {
    const hasDateParams =
      searchParams?.get("dateFrom") || searchParams?.get("dateTo");
    if (!hasDateParams) {
      const params = new URLSearchParams();
      params.set("dateFrom", defaultDateFrom);
      params.set("dateTo", defaultDateTo);
      router.push(`/portal/dashboard?${params.toString()}`);
    }
  }, [router, searchParams, defaultDateFrom, defaultDateTo]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFiltersVisible(false);
      }
    }

    if (isFiltersVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFiltersVisible]);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const handleApplyFilter = () => {
    const params = new URLSearchParams();
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);

    router.push(`/portal/dashboard?${params.toString()}`);
    setIsFiltersVisible(false);
  };

  const handleClearFilters = () => {
    setDateFrom(defaultDateFrom);
    setDateTo(defaultDateTo);
    const params = new URLSearchParams();
    params.set("dateFrom", defaultDateFrom);
    params.set("dateTo", defaultDateTo);
    router.push(`/portal/dashboard?${params.toString()}`);
  };

  const isDefaultFilter =
    dateFrom === defaultDateFrom && dateTo === defaultDateTo;
  const hasActiveFilters = !isDefaultFilter;

  return (
    <div className="relative z-10">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => setIsFiltersVisible(!isFiltersVisible)}
          className={`flex items-center gap-2 transition-colors hover:bg-neutral-100 ${
            isFiltersVisible ? "bg-neutral-100" : ""
          }`}
        >
          <FilterIcon className="h-4 w-4 text-neutral-600" />
          <span className="font-medium">Filtros</span>
          {hasActiveFilters && (
            <Badge
              variant="secondary"
              className="ml-1 bg-primary/10 text-primary hover:bg-primary/20"
            >
              1
            </Badge>
          )}
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="text-sm text-muted-foreground hover:text-neutral-900 transition-colors"
          >
            Limpar Filtros
          </Button>
        )}
      </div>

      {isFiltersVisible && (
        <div ref={filterRef}>
          <div className="absolute left-0 mt-2 bg-white border rounded-lg shadow-lg min-w-[600px] animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Data Inicial */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Data Inicial</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateFrom && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom
                          ? format(new Date(dateFrom), "dd/MM/yyyy")
                          : "Data Inicial"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <Calendar
                        mode="single"
                        selected={dateFrom ? new Date(dateFrom) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            const formatted = format(
                              date,
                              "yyyy-MM-dd'T'HH:mm"
                            );
                            setDateFrom(formatted);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Data Final */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Data Final</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateTo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo
                          ? format(new Date(dateTo), "dd/MM/yyyy")
                          : "Data Final"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start"
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <Calendar
                        mode="single"
                        selected={dateTo ? new Date(dateTo) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            const formatted = format(
                              date,
                              "yyyy-MM-dd'T'HH:mm"
                            );
                            setDateTo(formatted);
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-md border">
                <CalendarIcon className="w-5 h-5 text-neutral-600" />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-neutral-500">
                      De:
                    </span>
                    <span className="text-sm font-medium text-neutral-800">
                      {dateFrom ? formatDate(new Date(dateFrom)) : "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-neutral-500">
                      Até:
                    </span>
                    <span className="text-sm font-medium text-neutral-800">
                      {dateTo ? formatDate(new Date(dateTo)) : "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 mt-4 border-t">
                <Button
                  onClick={handleApplyFilter}
                  className="flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Filtrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
