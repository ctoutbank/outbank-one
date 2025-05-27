"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {CalendarIcon, Search} from "lucide-react";
import { KeyboardEvent, useState } from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import * as React from "react";

type TerminalsFilterContentProps = {
  dateFromIn?: Date;
  dateToIn?: Date;
  numeroLogicoIn?: string;
  numeroSerialIn?: string;
  estabelecimentoIn?: string;
  modeloIn?: string;
  statusIn?: string;
  provedorIn?: string;
  onFilter: (filters: {
    dateFrom?: Date;
    dateTo?: Date;
    numeroLogico: string;
    numeroSerial: string;
    estabelecimento: string;
    modelo: string;
    status: string;
    provedor: string;
  }) => void;
  onClose: () => void;
};

export function TerminalsFilterContent({
  dateFromIn,
  dateToIn,
  numeroLogicoIn,
  numeroSerialIn,
  estabelecimentoIn,
  modeloIn,
  statusIn,
  provedorIn,
  onFilter,
  onClose,
}: TerminalsFilterContentProps) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(dateFromIn);
  const [dateTo, setDateTo] = useState<Date | undefined>(dateToIn);
  const [numeroLogico, setNumeroLogico] = useState(numeroLogicoIn || "");
  const [numeroSerial, setNumeroSerial] = useState(numeroSerialIn || "");
  const [estabelecimento, setEstabelecimento] = useState(
    estabelecimentoIn || ""
  );
  const [modelo, setModelo] = useState(modeloIn || "");
  const [status, setStatus] = useState(statusIn || "");
  const [provedor, setProvedor] = useState(provedorIn || "");

  const statuses = [
    {
      value: "ACTIVE",
      label: "Ativo",
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
    {
      value: "INACTIVE",
      label: "Inativo",
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      value: "MAINTENANCE",
      label: "Manutenção",
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
  ];

  const applyFilters = () => {
    console.log(dateFrom, dateTo)
    onFilter({
      dateFrom,
      dateTo,
      numeroLogico,
      numeroSerial,
      estabelecimento,
      modelo,
      status,
      provedor,
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

  const handlePopoverContentClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o evento de clique se propague para o trigger
  };

  return (
    <div
      className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[900px] z-[999] w-[900px]"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Número Lógico</h3>
          <Input
            placeholder="Número lógico"
            value={numeroLogico}
            onChange={(e) => setNumeroLogico(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Número Serial</h3>
          <Input
            placeholder="Número serial"
            value={numeroSerial}
            onChange={(e) => setNumeroSerial(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Provedor</h3>
          <Input
            placeholder="Provedor"
            value={provedor}
            onChange={(e) => setProvedor(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Estabelecimento</h3>
          <Input
            placeholder="Estabelecimento"
            value={estabelecimento}
            onChange={(e) => setEstabelecimento(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Modelo</h3>
          <Input
            placeholder="Modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            onKeyDown={handleKeyDown}
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
                  "cursor-pointer w-20 h-7 select-none text-sm",
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
          <h3 className="text-sm font-medium">Data Inicial</h3>
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
                  <p></p>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "De"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[1001]" align="start" onMouseDown={(e) => e.stopPropagation()}>
                <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Data Final</h3>
          <div className="flex flex-col gap-2">
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
                  {dateTo ? format(dateTo, "dd/MM/yyyy") : "Até"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[1001]" align="start" onClick={handlePopoverContentClick} onMouseDown={(e) => e.stopPropagation()}>
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
