"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { validateDateRange } from "@/lib/validations/date";
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import { KeyboardEvent, useState } from "react";

type FilterPaymentLinkContentProps = {
  dateFromIn?: Date;
  dateToIn?: Date;
  statusIn?: string;
  onFilter: (filters: {
    dateFrom?: Date;
    dateTo?: Date;
    status: string;
  }) => void;
  onClose: () => void;
};

export function FilterPaymentLinkContent({
  dateFromIn,
  dateToIn,
  statusIn,
  onFilter,
  onClose,
}: FilterPaymentLinkContentProps) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(dateFromIn);
  const [dateTo, setDateTo] = useState<Date | undefined>(dateToIn);
  const [status, setStatus] = useState(statusIn || "");
  const [dateError, setDateError] = useState<string | null>(null);

  const statuses = [
    { value: "pending", label: "Pendente" },
    { value: "paid", label: "Pago" },
    { value: "expired", label: "Expirado" },
    { value: "cancelled", label: "Cancelado" },
  ];

  const applyFilters = () => {
    const validation = validateDateRange(dateFrom, dateTo);
    if (!validation.isValid) {
      setDateError(validation.error);
      return;
    }
    setDateError(null);
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
              <Button
                key={s.value}
                variant={status === s.value ? "default" : "outline"}
                size="sm"
                onClick={() => setStatus(status === s.value ? "" : s.value)}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Intervalo de Datas</h3>
          {dateError && <p className="text-sm text-red-500">{dateError}</p>}
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
                  onSelect={(date) => {
                    setDateFrom(date);
                    setDateError(null);
                  }}
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
                  onSelect={(date) => {
                    setDateTo(date);
                    setDateError(null);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button onClick={applyFilters} className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Filtrar
        </Button>
      </div>
    </div>
  );
}
