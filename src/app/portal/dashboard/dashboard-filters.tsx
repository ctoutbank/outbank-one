"use client";
import { DatePickerCustom } from "@/components/date-picker-custom";
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
  const viewMode = searchParams.get("viewMode") || "today";

  const handleFilterChange = (viewMode: string) => {
    router.push(`/portal/dashboard?viewMode=${viewMode}`);
  };
  const handleDateChange = (date: DateRange) => {};
  return (
    <div className="flex justify-start mb-4 gap-2 items-center">
      {/* <DatePickerCustom
        onDateSelect={handleDateChange}
        defaultValue={dateRange}
      /> */}
      <ToggleGroup
        type="single"
        onValueChange={handleFilterChange}
        value={viewMode}
      >
        <ToggleGroupItem
          value="yesterday"
          aria-label="Toggle ontem"
          className="border"
        >
          Ontem
        </ToggleGroupItem>
        <ToggleGroupItem
          value="today"
          aria-label="Toggle hoje"
          className="border "
        >
          Hoje
        </ToggleGroupItem>
        <ToggleGroupItem
          value="week"
          aria-label="Toggle semana"
          className="border"
        >
          Semana
        </ToggleGroupItem>
        <ToggleGroupItem
          value="month"
          aria-label="Toggle mês"
          className="border"
        >
          Mês
        </ToggleGroupItem>

        <ToggleGroupItem
          value="year"
          aria-label="Toggle ano"
          className="border"
        >
          Ano
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="flex gap-2 p-2 bg-neutral-100 text-xs font-thin rounded-md justify-center items-center">
        <CalendarIcon className="w-4 h-4" />
        <div className="flex flex-col">
          <span>De: {dateRange.from?.toLocaleString()}</span>
          <span>Até: {dateRange.to?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
