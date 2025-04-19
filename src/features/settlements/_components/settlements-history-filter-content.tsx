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
import { CalendarIcon, Search } from "lucide-react";
import { KeyboardEvent, useState } from "react";

type SettlementsHistoryFilterContentProps = {
  statusIn?: string;
  dateFromIn?: Date;
  dateToIn?: Date;
  onFilter: (filters: {
    status: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) => void;
  onClose: () => void;
};

export function SettlementsHistoryFilterContent({
  statusIn,
  dateFromIn,
  dateToIn,
  onFilter,
  onClose,
}: SettlementsHistoryFilterContentProps) {
  const [status, setStatus] = useState(statusIn || "");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(dateFromIn);
  const [dateTo, setDateTo] = useState<Date | undefined>(dateToIn);

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

  const applyFilters = () => {
    onFilter({ status, dateFrom, dateTo });
    onClose();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyFilters();
    }
  };

  return (
    <div
      className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[600px]"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Status</h3>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <Badge
                key={s.value}
                variant="secondary"
                className={cn(
                  "cursor-pointer w-28 h-8 select-none",
                  status === s.value ? s.color : "bg-secondary",
                  status === s.value
                    ? "text-white"
                    : "text-secondary-foreground"
                )}
                onClick={() => setStatus(status === s.value ? "" : s.value)}
              >
                {s.label}
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
        </div>
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t">
        <Button onClick={applyFilters} className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Filtrar
        </Button>
      </div>
    </div>
  );
}
