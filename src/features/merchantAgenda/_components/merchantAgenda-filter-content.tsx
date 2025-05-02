"use client";

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
import { KeyboardEvent, useState } from "react";

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
  setLoading: (loading: boolean) => void;
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
  setLoading,
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
    { value: "PENDING", label: "Pendente" },
    { value: "PROCESSING", label: "Processando" },
    { value: "SETTLED", label: "Liquidado" },
    { value: "FAILED", label: "Falhou" },
  ];

  const cardBrands = [
    { value: "VISA", label: "Visa" },
    { value: "MASTERCARD", label: "Mastercard" },
    { value: "ELO", label: "Elo" },
    { value: "AMEX", label: "American Express" },
    { value: "HIPERCARD", label: "Hipercard" },
    { value: "NÃO IDENTIFICADA", label: "Não Identificada" },
  ];

  const handleStatusChange = (value: string) => {
    setStatus(value === "all" ? "" : value);
  };

  const handleCardBrandChange = (value: string) => {
    setCardBrand(value === "all" ? "" : value);
  };

  const applyFilters = () => {
    setLoading(true);
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
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLDivElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyFilters();
    }
  };

  return (
    <div
      className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md w-[900px]"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-xs font-medium mb-1.5">Estabelecimento</div>
          <Input
            placeholder="Nome do estabelecimento"
            value={establishment}
            onChange={(e) => setEstablishment(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-9"
          />
        </div>

        <div>
          <div className="text-xs font-medium mb-1.5">Status</div>
          <Select value={status || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="text-xs font-medium mb-1.5">Bandeira</div>
          <Select
            value={cardBrand || "all"}
            onValueChange={handleCardBrandChange}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Selecione a bandeira" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {cardBrands.map((brand) => (
                <SelectItem key={brand.value} value={brand.value}>
                  {brand.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="text-xs font-medium mb-1.5">Data de Venda</div>
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-9 text-xs justify-start text-left font-normal",
                    !dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Inicial"}
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
                  size="sm"
                  className={cn(
                    "h-9 text-xs justify-start text-left font-normal",
                    !dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {dateTo ? format(dateTo, "dd/MM/yyyy") : "Final"}
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

        <div>
          <div className="text-xs font-medium mb-1.5">Data de Liquidação</div>
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-9 text-xs justify-start text-left font-normal",
                    !settlementDateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {settlementDateFrom
                    ? format(settlementDateFrom, "dd/MM/yyyy")
                    : "Inicial"}
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
                  size="sm"
                  className={cn(
                    "h-9 text-xs justify-start text-left font-normal",
                    !settlementDateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {settlementDateTo
                    ? format(settlementDateTo, "dd/MM/yyyy")
                    : "Final"}
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

        <div>
          <div className="text-xs font-medium mb-1.5">
            Data Prevista de Liquidação
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-9 text-xs justify-start text-left font-normal",
                    !expectedSettlementDateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {expectedSettlementDateFrom
                    ? format(expectedSettlementDateFrom, "dd/MM/yyyy")
                    : "Inicial"}
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
                  size="sm"
                  className={cn(
                    "h-9 text-xs justify-start text-left font-normal",
                    !expectedSettlementDateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {expectedSettlementDateTo
                    ? format(expectedSettlementDateTo, "dd/MM/yyyy")
                    : "Final"}
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
          onClick={applyFilters}
          className="flex items-center gap-2"
          size="sm"
        >
          <Search className="h-4 w-4" />
          Filtrar
        </Button>
      </div>
    </div>
  );
}
