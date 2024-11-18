"use client";
import { DatePickerCustom } from "@/components/date-picker-custom";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";

interface DashboardFiltersProps {
  viewMode: string;
  dateRange: DateRange;
}

export default function DashboardFilters({
  viewMode,
  dateRange,
}: DashboardFiltersProps) {
  const router = useRouter();
  const handleFilterChange = (filter: string) => {
    router.push(`/portal/dashboard?viewMode=${filter}`);
  };
  const handleDateChange = (date: DateRange) => {
    router.push(
      `/portal/dashboard?dateFrom=${date.from?.toISOString()}&dateTo=${date.to?.toISOString()}`
    );
  };
  return (
    <div className="flex justify-start mb-4 gap-2">
      <DatePickerCustom
        onDateSelect={handleDateChange}
        defaultValue={dateRange}
      />
      <ToggleGroup type="single" onValueChange={handleFilterChange}>
        <ToggleGroupItem
          value="semana"
          aria-label="Toggle semana"
          className="border"
        >
          Semana
        </ToggleGroupItem>
        <ToggleGroupItem value="mes" aria-label="Toggle mês" className="border">
          Mês
        </ToggleGroupItem>
        <ToggleGroupItem value="ano" aria-label="Toggle ano" className="border">
          Ano
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
