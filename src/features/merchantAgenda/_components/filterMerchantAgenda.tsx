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
import { CalendarIcon, FilterIcon, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FilterMerchantAgenda({
  dateFromIn,
  dateToIn,
  establishmentIn,
  statusIn,
  cardBrandIn,
  settlementDateFromIn,
  settlementDateToIn,
  expectedSettlementDateFromIn,
  expectedSettlementDateToIn,
}: {
  dateFromIn: Date | undefined;
  dateToIn: Date | undefined;
  establishmentIn?: string;
  statusIn?: string;
  cardBrandIn?: string;
  settlementDateFromIn?: Date;
  settlementDateToIn?: Date;
  expectedSettlementDateFromIn?: Date;
  expectedSettlementDateToIn?: Date;
}) {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(dateFromIn);
  const [dateTo, setDateTo] = useState<Date | undefined>(dateToIn);
  const [establishment, setEstablishment] = useState(establishmentIn || "");
  const [status, setStatus] = useState(statusIn || "");
  const [cardBrand, setCardBrand] = useState(cardBrandIn || "");
  const [settlementDateFrom, setSettlementDateFrom] = useState<Date | undefined>(
    settlementDateFromIn
  );
  const [settlementDateTo, setSettlementDateTo] = useState<Date | undefined>(
    settlementDateToIn
  );
  const [expectedSettlementDateFrom, setExpectedSettlementDateFrom] = useState<
    Date | undefined
  >(expectedSettlementDateFromIn);
  const [expectedSettlementDateTo, setExpectedSettlementDateTo] = useState<
    Date | undefined
  >(expectedSettlementDateToIn);

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || "");

  const statuses = [
    { value: "PENDING", label: "Pendente", color: "bg-orange-500 hover:bg-orange-600" },
    { value: "PROCESSING", label: "Processando", color: "bg-yellow-500 hover:bg-yellow-600" },
    { value: "SETTLED", label: "Liquidado", color: "bg-emerald-500 hover:bg-emerald-600" },
    { value: "FAILED", label: "Falhou", color: "bg-red-500 hover:bg-red-600" },
  ];

  const cardBrands = [
    { value: "all", label: "Todas" },
    { value: "VISA", label: "Visa" },
    { value: "MASTERCARD", label: "Mastercard" },
    { value: "ELO", label: "Elo" },
    { value: "AMEX", label: "American Express" },
    { value: "HIPERCARD", label: "Hipercard" },
  ];

  const handleFilter = () => {
    if (dateFrom) {
      params.set("dateFrom", dateFrom.toISOString());
    } else {
      params.delete("dateFrom");
    }

    if (dateTo) {
      params.set("dateTo", dateTo.toISOString());
    } else {
      params.delete("dateTo");
    }

    if (establishment) {
      params.set("establishment", establishment);
    } else {
      params.delete("establishment");
    }

    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    if (cardBrand && cardBrand !== "all") {
      params.set("cardBrand", cardBrand);
    } else {
      params.delete("cardBrand");
    }

    if (settlementDateFrom) {
      params.set("settlementDateFrom", settlementDateFrom.toISOString());
    } else {
      params.delete("settlementDateFrom");
    }

    if (settlementDateTo) {
      params.set("settlementDateTo", settlementDateTo.toISOString());
    } else {
      params.delete("settlementDateTo");
    }

    if (expectedSettlementDateFrom) {
      params.set(
        "expectedSettlementDateFrom",
        expectedSettlementDateFrom.toISOString()
      );
    } else {
      params.delete("expectedSettlementDateFrom");
    }

    if (expectedSettlementDateTo) {
      params.set(
        "expectedSettlementDateTo",
        expectedSettlementDateTo.toISOString()
      );
    } else {
      params.delete("expectedSettlementDateTo");
    }

    params.set("page", "1");
    router.push(`?${params.toString()}`);
    setIsFiltersVisible(false);
  };

  const handleClearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setEstablishment("");
    setStatus("");
    setCardBrand("");
    setSettlementDateFrom(undefined);
    setSettlementDateTo(undefined);
    setExpectedSettlementDateFrom(undefined);
    setExpectedSettlementDateTo(undefined);
    params.delete("dateFrom");
    params.delete("dateTo");
    params.delete("establishment");
    params.delete("status");
    params.delete("cardBrand");
    params.delete("settlementDateFrom");
    params.delete("settlementDateTo");
    params.delete("expectedSettlementDateFrom");
    params.delete("expectedSettlementDateTo");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
    setIsFiltersVisible(false);
  };

  const activeFiltersCount =
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0) +
    (establishment ? 1 : 0) +
    (status ? 1 : 0) +
    (cardBrand ? 1 : 0) +
    (settlementDateFrom ? 1 : 0) +
    (settlementDateTo ? 1 : 0) +
    (expectedSettlementDateFrom ? 1 : 0) +
    (expectedSettlementDateTo ? 1 : 0);

  return (
    <div className="w-full space-y-2 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            className="flex items-center gap-2 mb-2 mt-2"
          >
            <FilterIcon className="h-4 w-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </Button>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              className="text-sm text-muted-foreground"
            >
              Limpar Filtros
            </Button>
          )}
        </div>
      </div>

      {isFiltersVisible && (
        <div className="bg-background border rounded-lg p-4 shadow-md">
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
                      status === s.value ? "text-white" : "text-secondary-foreground"
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

          <div className="flex justify-start pt-4 mt-4 border-t">
            <Button onClick={handleFilter} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Filtrar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}