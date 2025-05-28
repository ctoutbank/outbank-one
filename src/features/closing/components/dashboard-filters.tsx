"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import * as React from "react";

interface DashboardFiltersProps {
  dateRange: {
    from: string;
    to: string;
  };
}

export default function DashboardFilters({ dateRange }: DashboardFiltersProps) {
  const router = useRouter();
  // Inicializa o estado do mês atual a partir do dateRange
  const initial = React.useMemo(() => {
    try {
      return DateTime.fromISO(dateRange.from).startOf("month");
    } catch {
      return DateTime.utc().startOf("month");
    }
  }, [dateRange.from]);

  const [currentMonth, setCurrentMonth] = React.useState(initial);

  // Calcula o primeiro e último dia do mês selecionado
 

  // Mês máximo permitido (mês atual)
  const nowMonth = DateTime.utc().startOf("month");
  const canNext = currentMonth < nowMonth;

  // Atualiza a URL com os parâmetros de filtro
  const updateUrl = (dt: DateTime) => {
    const f = dt.startOf("month").toISO({ suppressMilliseconds: true });
    const t = dt.endOf("month").toISO({ suppressMilliseconds: true });
    router.push(
      `/portal/closing?viewMode=month&dateFrom=${encodeURIComponent(
        f ? f : ""
      )}&dateTo=${encodeURIComponent(t ? t : "")}`
    );
  };

  const handlePrev = () => {
    const prev = currentMonth.minus({ months: 1 }).startOf("month");
    setCurrentMonth(prev);
    updateUrl(prev);
  };

  const handleNext = () => {
    if (!canNext) return;
    const next = currentMonth.plus({ months: 1 }).startOf("month");
    setCurrentMonth(next);
    updateUrl(next);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button size="sm" variant="outline" onClick={handlePrev}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium">
        {currentMonth.setLocale("pt-BR").toFormat("LLLL yyyy")}
      </span>
      <Button
        size="sm"
        variant="outline"
        onClick={handleNext}
        disabled={!canNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
