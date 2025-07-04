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
import { CalendarIcon, Search } from "lucide-react";
import * as React from "react";
import { KeyboardEvent, useState } from "react";

type TerminalsFilterContentProps = {
  dateToIn?: Date;
  numeroLogicoIn?: string;
  numeroSerialIn?: string;
  estabelecimentoIn?: string;
  modeloIn?: string;
  statusIn?: string;
  provedorIn?: string;
  onFilter: (filters: {
    dateTo?: string;
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
      value: "DEACTIVATED",
      label: "Desativado",
      color: "bg-red-600 hover:bg-red-700",
    },
  ];

  const applyFilters = () => {

    onFilter({
      dateTo: dateTo ? format(String(dateTo), "yyyy-MM-dd") : undefined,
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
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      <div
        className="bg-background border rounded-lg p-6 shadow-xl min-w-[900px] max-w-[90vw] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

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
            <h3 className="text-sm font-medium">Data de Inclusão</h3>
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
                    {dateTo ? format(dateTo, "dd/MM/yyyy") : "dd/mm/aaaa"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 z-[1000]"
                  align="start"
                  onClick={handlePopoverContentClick}
                  onMouseDown={(e) => e.stopPropagation()}
                >
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
    </div>
  );
}
