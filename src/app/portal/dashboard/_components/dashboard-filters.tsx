"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CalendarIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { DateRange } from "react-day-picker";

interface DashboardFiltersProps {
  dateRange: DateRange;
}

export default function DashboardFilters({ dateRange }: DashboardFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewMode = searchParams?.get("viewMode") || "today";

  const formatDate = (date: Date | undefined) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const handleFilterChange = (viewMode: string) => {
    router.push(`/portal/dashboard?viewMode=${viewMode}`);
  };

  return (
    <div className="flex items-center mb-4 gap-4 p-4 bg-white rounded-lg shadow-sm border">
      <ToggleGroup
        type="single"
        onValueChange={handleFilterChange}
        value={viewMode}
        className="flex gap-1"
      >
        <ToggleGroupItem
          value="yesterday"
          aria-label="Toggle ontem"
          className="px-4 py-2 border rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-neutral-100 transition-colors"
        >
          Ontem
        </ToggleGroupItem>
        <ToggleGroupItem
          value="today"
          aria-label="Toggle hoje"
          className="px-4 py-2 border rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-neutral-100 transition-colors"
        >
          Hoje
        </ToggleGroupItem>
        <ToggleGroupItem
          value="week"
          aria-label="Toggle semana"
          className="px-4 py-2 border rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-neutral-100 transition-colors"
        >
          Semana
        </ToggleGroupItem>
        <ToggleGroupItem
          value="month"
          aria-label="Toggle mês"
          className="px-4 py-2 border rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-neutral-100 transition-colors"
        >
          Mês
        </ToggleGroupItem>
        <ToggleGroupItem
          value="year"
          aria-label="Toggle ano"
          className="px-4 py-2 border rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground hover:bg-neutral-100 transition-colors"
        >
          Ano
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="flex items-center gap-4 px-5 py-2.5 bg-neutral-50 rounded-md border hover:bg-neutral-100 transition-colors">
        <CalendarIcon className="w-5 h-5 text-neutral-600" />
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-neutral-400">De:</span>
            <span className="text-sm font-medium text-neutral-700">{formatDate(dateRange.from)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-neutral-400">Até:</span>
            <span className="text-sm font-medium text-neutral-700">{formatDate(dateRange.to)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
