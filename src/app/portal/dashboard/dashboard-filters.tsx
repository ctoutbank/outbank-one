"use client";
import { DatePickerCustom } from "@/components/date-picker-custom";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";

interface DashboardFiltersProps {
  dateRange: DateRange;
}

export default function DashboardFilters({ dateRange }: DashboardFiltersProps) {
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
          value="ontem"
          aria-label="Toggle ontem"
          className="border bg-primary text-primary-foreground"
        >
          Ontem
        </ToggleGroupItem>
        <ToggleGroupItem
          value="hoje"
          aria-label="Toggle hoje"
          className="border bg-primary text-primary-foreground"
        >
          Hoje
        </ToggleGroupItem>
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
