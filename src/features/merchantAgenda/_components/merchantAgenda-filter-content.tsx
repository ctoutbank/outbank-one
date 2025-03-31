"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import { useState } from "react";

type MerchantAgendaFilterContentProps = {
  dateFromIn?: Date;
  dateToIn?: Date;
  establishmentIn?: string;
  statusIn?: string;
  cardBrandIn?: string;
  settlementDateFromIn?: Date;
  settlementDateToIn?: Date;
  expectedSettlementDateFromIn?: Date;
  expectedSettlementDateToIn?: Date;
  onFilter: (filters: {
    dateFrom?: Date;
    dateTo?: Date;
    establishment: string;
    status: string;
    cardBrand: string;
    settlementDateFrom?: Date;
    settlementDateTo?: Date;
    expectedSettlementDateFrom?: Date;
    expectedSettlementDateTo?: Date;
  }) => void;
  onClose: () => void;
};

export function MerchantAgendaFilterContent({
  dateFromIn,
  dateToIn,
  establishmentIn,
  statusIn,
  cardBrandIn,
  settlementDateFromIn,
  settlementDateToIn,
  expectedSettlementDateFromIn,
  expectedSettlementDateToIn,
  onFilter,
  onClose,
}: MerchantAgendaFilterContentProps) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(dateFromIn);
  const [dateTo, setDateTo] = useState<Date | undefined>(dateToIn);
  const [establishment, setEstablishment] = useState(establishmentIn || "");
  const [status, setStatus] = useState(statusIn || "");
  const [cardBrand, setCardBrand] = useState(cardBrandIn || "");
  const [settlementDateFrom, setSettlementDateFrom] = useState<
    Date | undefined
  >(settlementDateFromIn);
  const [settlementDateTo, setSettlementDateTo] = useState<Date | undefined>(
    settlementDateToIn
  );
  const [expectedSettlementDateFrom, setExpectedSettlementDateFrom] = useState<
    Date | undefined
  >(expectedSettlementDateFromIn);
  const [expectedSettlementDateTo, setExpectedSettlementDateTo] = useState<
    Date | undefined
  >(expectedSettlementDateToIn);

  const statuses = [
    {
      value: "PENDING",
      label: "Pendente",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      value: "PROCESSING",
      label: "Processando",
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
      value: "SETTLED",
      label: "Liquidado",
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
    { value: "FAILED", label: "Falhou", color: "bg-red-500 hover:bg-red-600" },
  ];

  const cardBrands = [
    { value: "all", label: "Todas" },
    { value: "VISA", label: "Visa" },
    { value: "MASTERCARD", label: "Mastercard" },
    { value: "ELO", label: "Elo" },
    { value: "AMEX", label: "American Express" },
    { value: "HIPERCARD", label: "Hipercard" },
    { value: "NÃO IDENTIFICADA", label: "Não Identificada" },
  ];

  return (
    <div className="relative mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[1100px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Estabelecimento</h3>
          <Input
            placeholder="Nome do estabelecimento"
            value={establishment}
            onChange={(e) => setEstablishment(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Status</h3>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <Badge
                key={s.value}
                variant="secondary"
                className={cn(
                  "cursor-pointer w-24 h-7 select-none text-sm",
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
          <h3 className="text-sm font-medium">Bandeira</h3>
          <Select value={cardBrand || "all"} onValueChange={setCardBrand}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a bandeira" />
            </SelectTrigger>
            <SelectContent>
              {cardBrands.map((brand) => (
                <SelectItem key={brand.value} value={brand.value}>
                  {brand.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Data de Venda</h3>
          <div className="flex flex-col gap-2">
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
                    "w-full justify-start text-left font-normal",
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

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Data de Liquidação</h3>
          <div className="flex flex-col gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !settlementDateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {settlementDateFrom
                    ? format(settlementDateFrom, "PPP")
                    : "Data Inicial"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={settlementDateFrom}
                  onSelect={setSettlementDateFrom}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !settlementDateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {settlementDateTo
                    ? format(settlementDateTo, "PPP")
                    : "Data Final"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={settlementDateTo}
                  onSelect={setSettlementDateTo}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Data Prevista de Liquidação</h3>
          <div className="flex flex-col gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
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
                  onSelect={setExpectedSettlementDateFrom}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
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
                  onSelect={setExpectedSettlementDateTo}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t">
        <Button
          onClick={() => {
            onFilter({
              dateFrom,
              dateTo,
              establishment,
              status,
              cardBrand,
              settlementDateFrom,
              settlementDateTo,
              expectedSettlementDateFrom,
              expectedSettlementDateTo,
            });
            onClose();
          }}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Filtrar
        </Button>
      </div>
    </div>
  );
}
