"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {CalendarIcon, Search} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { format as formatDate } from "date-fns";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {cn} from "@/lib/utils";


type ReportsFilterContentProps = {
  searchIn?: string;
  typeIn?: string;
  formatIn?: string;
  recurrenceIn?: string;
  periodIn?: string;
  emailIn?: string;
  creationDateIn?: Date;
  onFilter: (filters: {
    search: string;
    type: string;
    format: string;
    recurrence: string;
    period: string;
    email: string;
    creationDate?: Date;
  }) => void;
  onClose: () => void;
};

export function ReportsFilterContent({
  searchIn,
  typeIn,
  formatIn,
  recurrenceIn,
  periodIn,
  emailIn,
  creationDateIn,
  onFilter,
  onClose,
}: ReportsFilterContentProps) {
  const [search, setSearch] = useState(searchIn || "");
  const [type, setType] = useState(typeIn || "");
  const [format, setFormat] = useState(formatIn || "");
  const [recurrence, setRecurrence] = useState(recurrenceIn || "");
  const [period, setPeriod] = useState(periodIn || "");
  const [email, setEmail] = useState(emailIn || "");
  const [creationDate, setCreationDate] = useState<Date | undefined>(
    creationDateIn
  );

  const filterRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
      onClose(); // Fecha o filtro se o clique for fora do conteúdo
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Dados estáticos para os filtros
  const types = [
    { code: "VN", name: "Vendas" },
    { code: "AL", name: "Agenda dos Lojistas" },
  ];

  const formats = [
    { code: "PDF", name: "PDF" },
    { code: "EX", name: "Excel" },
  ];

  const recorrences = [
    { code: "DIA", name: "Diário" },
    { code: "SEM", name: "Semanal" },
    { code: "MES", name: "Mensal" },
  ];

  const periods = [
    { code: "DT", name: "Dia Atual" },
    { code: "DA", name: "Dia Anterior" },
    { code: "SA", name: "Semana Atual" },
    { code: "SR", name: "Semana Anterior" },
    { code: "MA", name: "Mês Atual" },
    { code: "MR", name: "Mês Anterior" },
  ];

  // Função para lidar com a alteração do tipo
  const handleTypeChange = (value: string) => {
    setType(value === "all" ? "" : value);
  };

  // Função para lidar com a alteração do formato
  const handleFormatChange = (value: string) => {
    setFormat(value === "all" ? "" : value);
  };

  // Função para lidar com a alteração da recorrência
  const handleRecurrenceChange = (value: string) => {
    setRecurrence(value === "all" ? "" : value);
  };

  // Função para lidar com a alteração do período
  const handlePeriodChange = (value: string) => {
    setPeriod(value === "all" ? "" : value);
  };

  // Função para aplicar os filtros e fechar o modal
  const applyFilters = () => {
    onFilter({
      search,
      type,
      format,
      recurrence,
      period,
      email,
      creationDate,
    });
    onClose();
  };

  // Handler para a tecla Enter
  const handleKeyDown = (
    e: React.KeyboardEvent<any>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyFilters();
    }
  };

  return (
    <div
      ref={filterRef}
      className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md w-[900px]"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-xs font-medium mb-1.5">Título do Relatório</div>
          <Input
            placeholder="Título do relatório"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-9"
          />
        </div>

        <div>
          <div className="text-xs font-medium mb-1.5">Email</div>
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-9"
          />
        </div>

        <div>
          <div className="text-xs font-medium mb-1.5">Data de Criação</div>
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative w-full">
                <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Button
                    variant="outline"
                    className={cn(
                        "w-full pl-8 text-left font-normal h-9",
                        !creationDate && "text-muted-foreground"
                    )}
                    onKeyDown={handleKeyDown}
                >
                  {creationDate ? formatDate(creationDate, "dd/MM/yyyy") : "Selecionar data"}
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent
                className="w-auto p-0"
                align="start"
                onMouseDown={(e) => e.stopPropagation()}
            >
              <Calendar
                  mode="single"
                  selected={creationDate}
                  onSelect={(date) => setCreationDate(date ?? undefined)}
                  initialFocus
                  toDate={new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <div className="text-xs font-medium mb-1.5">Tipo de Relatório</div>
          <Select value={type || "all"} onValueChange={handleTypeChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent onMouseDown={(e) => e.stopPropagation()}>
              <SelectItem value="all">Todos</SelectItem>
              {types.map((t) => (
                <SelectItem key={t.code} value={t.code}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="text-xs font-medium mb-1.5">Formato</div>
          <Select value={format || "all"} onValueChange={handleFormatChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Selecione o formato" />
            </SelectTrigger>
            <SelectContent onMouseDown={(e) => e.stopPropagation()}>
              <SelectItem value="all">Todos</SelectItem>
              {formats.map((f) => (
                <SelectItem key={f.code} value={f.code}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="text-xs font-medium mb-1.5">Recorrência</div>
          <Select
            value={recurrence || "all"}
            onValueChange={handleRecurrenceChange}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Selecione a recorrência" />
            </SelectTrigger>
            <SelectContent onMouseDown={(e) => e.stopPropagation()}>
              <SelectItem value="all">Todas</SelectItem>
              {recorrences.map((r) => (
                <SelectItem key={r.code} value={r.code}>
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="text-xs font-medium mb-1.5">Período</div>
          <Select value={period || "all"} onValueChange={handlePeriodChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent onMouseDown={(e) => e.stopPropagation()}>
              <SelectItem value="all">Todos</SelectItem>
              {periods.map((p) => (
                <SelectItem key={p.code} value={p.code}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
