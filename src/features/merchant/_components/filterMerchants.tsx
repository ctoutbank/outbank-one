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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, FilterIcon, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FilterMerchants({
  dateFromIn,
  dateToIn,
  establishmentIn,
  statusIn,
  stateIn,
}: {
  dateFromIn?: Date;
  dateToIn?: Date;
  establishmentIn?: string;
  statusIn?: string;
  stateIn?: string;
}) {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(dateFromIn);
  const [dateTo, setDateTo] = useState<Date | undefined>(dateToIn);
  const [establishment, setEstablishment] = useState(establishmentIn || "");
  const [status, setStatus] = useState(statusIn || "");
  const [state, setState] = useState(stateIn || "");

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || "");

  const statuses = [
    { value: "APPROVED", label: "Aprovado", color: "bg-emerald-500 hover:bg-emerald-600" },
    { value: "PENDING", label: "Pendente", color: "bg-yellow-500 hover:bg-yellow-600" },
    { value: "REJECTED", label: "Rejeitado", color: "bg-red-500 hover:bg-red-600" },
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

    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    if (state) {
      params.set("state", state);
    } else {
      params.delete("state");
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
    setState("");
    params.delete("dateFrom");
    params.delete("dateTo");
    params.delete("establishment");
    params.delete("status");
    params.delete("state");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
    setIsFiltersVisible(false);
  };

  const activeFiltersCount =
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0) +
    (establishment ? 1 : 0) +
    (status ? 1 : 0) +
    (state ? 1 : 0);

  return (
    <div className="relative z-50">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => setIsFiltersVisible(!isFiltersVisible)}
          className="flex items-center gap-2"
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

      {isFiltersVisible && (
        <div className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[1100px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Estabelecimento</h3>
              <Input
                placeholder="Nome do estabelecimento"
                value={establishment}
                onChange={(e) => setEstablishment(e.target.value)}
              />
            </div>

            <div className="space-y-2 ml-8">
              <h3 className="text-sm font-medium ml-2">Status KYC</h3>
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
              <h3 className="text-sm font-medium">Estado</h3>
              <Input
                placeholder="UF"
                value={state}
                onChange={(e) => setState(e.target.value)}
                maxLength={2}
                className="uppercase"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Data de Cadastro</h3>
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