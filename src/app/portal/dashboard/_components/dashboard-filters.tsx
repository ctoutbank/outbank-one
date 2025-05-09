"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CalendarIcon, FilterIcon, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {useEffect, useRef, useState} from "react";

interface DashboardFiltersProps {
  dateRange: {
    from: string | undefined;
    to?: string | undefined;
  };
}

export default function DashboardFilters({ dateRange }: DashboardFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewMode = searchParams?.get("viewMode") || "today";
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [selectedViewMode, setSelectedViewMode] = useState(viewMode);


  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
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

  const handleFilterChange = (newViewMode: string) => {
    setSelectedViewMode(newViewMode);
  };

  const handleApplyFilter = () => {
    router.push(`/portal/dashboard?viewMode=${selectedViewMode}`);
    setIsFiltersVisible(false);
  };

  const handleClearFilters = () => {
    setSelectedViewMode("today");
    router.push("/portal/dashboard?viewMode=today");
  };

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
          {viewMode !== "today" && (
            <Badge
              variant="secondary"
              className="ml-1 bg-primary/10 text-primary hover:bg-primary/20"
            >
              1
            </Badge>
          )}
        </Button>
        {viewMode !== "today" && (
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
            <ToggleGroup
              type="single"
              onValueChange={handleFilterChange}
              value={selectedViewMode}
              className="flex gap-2"
            >
              {[
                { value: "yesterday", label: "Ontem" },
                { value: "today", label: "Hoje" },
                { value: "week", label: "Semana" },
                { value: "month", label: "Mês" },
                { value: "year", label: "Ano" },
              ].map((item) => (
                <ToggleGroupItem
                  key={item.value}
                  value={item.value}
                  aria-label={`Toggle ${item.label.toLowerCase()}`}
                  className="px-4 py-2 border rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-neutral-50 transition-colors"
                >
                  {item.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-md border">
              <CalendarIcon className="w-5 h-5 text-neutral-600" />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-neutral-500">
                    De:
                  </span>
                  <span className="text-sm font-medium text-neutral-800">
                    {formatDate(new Date(dateRange.from || ""))}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-neutral-500">
                    Até:
                  </span>
                  <span className="text-sm font-medium text-neutral-800">
                    {formatDate(new Date(dateRange.to || ""))}
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
