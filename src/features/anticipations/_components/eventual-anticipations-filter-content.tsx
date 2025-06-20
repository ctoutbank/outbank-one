"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MerchantDD } from "@/features/anticipations/server/anticipation";

import { cn } from "@/lib/utils";
import { validateDateRange } from "@/lib/validations/date";
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type EventualAnticipationsListFilterContentProps = {
  merchantDD?: MerchantDD[];
  dateFromIn?: Date;
  dateToIn?: Date;
  expectedSettlementDateFromIn?: Date;
  expectedSettlementDateToIn?: Date;
  merchantSlugIn?: string;
  typeIn?: string;
  statusIn?: string;
  onFilter: (filters: {
    dateFrom?: Date;
    dateTo?: Date;
    expectedSettlementDateFrom?: Date;
    expectedSettlementDateTo?: Date;
    merchantSlug?: string;
    type?: string;
    status: string;
  }) => void;
  onClose: () => void;
};

export function EventualAnticipationsListFilterContent({
                                                         dateFromIn,
                                                         dateToIn,
                                                         expectedSettlementDateFromIn,
                                                         expectedSettlementDateToIn,
                                                         merchantSlugIn,
                                                         typeIn,
                                                         statusIn,
                                                         onFilter,
                                                         onClose,
                                                         merchantDD,
                                                       }: EventualAnticipationsListFilterContentProps) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(dateFromIn);
  const [dateTo, setDateTo] = useState<Date | undefined>(dateToIn);
  const [expectedSettlementDateFrom, setExpectedSettlementDateFrom] = useState<
      Date | undefined
  >(expectedSettlementDateFromIn);
  const [expectedSettlementDateTo, setExpectedSettlementDateTo] = useState<
      Date | undefined
  >(expectedSettlementDateToIn);
  const [merchantSlug, setMerchantSlug] = useState(merchantSlugIn || "all");
  const [type, setType] = useState(typeIn || "");
  const [status, setStatus] = useState(statusIn || "");
  const [dateError, setDateError] = useState<string | null>(null);
  const [expectedDateError, setExpectedDateError] = useState<string | null>(
      null
  );

  const filterRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
      onClose(); // Fecha o filtro se clicar fora
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    const handleKeyDownGlobal = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDownGlobal);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDownGlobal);
    };
  }, [onClose]);

  const statuses = [
    {
      value: "pending",
      label: "Pendente",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      value: "approved",
      label: "Aprovado",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      value: "rejected",
      label: "Reprovado",
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      value: "cancelled",
      label: "Cancelado",
      color: "bg-gray-500 hover:bg-gray-600",
    },
    {
      value: "waiting",
      label: "Aguardando",
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
      value: "pre-approved",
      label: "Pré-Aprovado",
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
  ];

  const types = [
    {
      value: "CPN",
      label: "Cartão Não Presente",
    },
    {
      value: "CP",
      label: "Cartão Presente",
    },
    {
      value: "both",
      label: "Ambos",
    },
  ];

  const applyFilters = () => {
    const dateValidation = validateDateRange(dateFrom, dateTo);
    const expectedDateValidation = validateDateRange(
        expectedSettlementDateFrom,
        expectedSettlementDateTo
    );

    if (!dateValidation.isValid) {
      setDateError(dateValidation.error);
      return;
    }
    if (!expectedDateValidation.isValid) {
      setExpectedDateError(expectedDateValidation.error);
      return;
    }

    setDateError(null);
    setExpectedDateError(null);
    onFilter({
      dateFrom,
      dateTo,
      expectedSettlementDateFrom,
      expectedSettlementDateTo,
      merchantSlug,
      type,
      status,
    });
    onClose();
  };

  return (
      <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-0 duration-200"
          onClick={onClose}
      >
        <div
            ref={filterRef}
            className="bg-background border rounded-lg p-6 shadow-xl min-w-[700px] max-w-[90vw] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            tabIndex={0}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Estabelecimento</h3>
                <Select value={merchantSlug} onValueChange={setMerchantSlug}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um estabelecimento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {merchantDD?.map((merchant) => (
                        <SelectItem
                            key={merchant.slug}
                            value={merchant.slug || "all"}
                        >
                          {merchant.name}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Data Prevista de Liquidação</h3>
              {expectedDateError && (
                  <p className="text-sm text-red-500">{expectedDateError}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !expectedSettlementDateFrom && "text-muted-foreground"
                        )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expectedSettlementDateFrom
                          ? format(expectedSettlementDateFrom, "PPP")
                          : "Data Inicial"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={expectedSettlementDateFrom}
                        onSelect={(date) => {
                          setExpectedSettlementDateFrom(date);
                          setExpectedDateError(null);
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
                            !expectedSettlementDateTo && "text-muted-foreground"
                        )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expectedSettlementDateTo
                          ? format(expectedSettlementDateTo, "PPP")
                          : "Data Final"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={expectedSettlementDateTo}
                        onSelect={(date) => {
                          setExpectedSettlementDateTo(date);
                          setExpectedDateError(null);
                        }}
                        initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Tipo</h3>
              <div className="flex flex-wrap gap-2">
                {types.map((t) => (
                    <Badge
                        key={t.value}
                        variant="secondary"
                        className={cn(
                            "cursor-pointer w-48 h-8 select-none bg-secondary text-secondary-foreground",
                            type === t.value && "border-2 border-primary"
                        )}
                        onClick={() => setType(type === t.value ? "" : t.value)}
                    >
                      {t.label}
                    </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Status</h3>
              <div className="flex flex-wrap gap-2">
                {statuses.map((s) => (
                    <Badge
                        key={s.value}
                        variant="secondary"
                        className={cn(
                            "cursor-pointer w-48 h-8 select-none",
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
          </div>

          <div className="flex justify-end pt-4 mt-4 border-t">
            <Button onClick={applyFilters} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Filtrar
            </Button>
          </div>
        </div>
      </div>
  );
}
