"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useState, type KeyboardEvent } from "react";

interface FilterMerchantsContentProps {
  onClose: () => void;
  onFilter: (filters: any) => void;
  StatusKyc: { value: string; label: string }[] | undefined;
  dateFromIn: Date | undefined;
  establishmentIn: string | undefined;
  statusIn: string | undefined;
  stateIn: string | undefined;
  emailIn: string | undefined;
  cnpjIn: string | undefined;
  activeIn: string | undefined;
  salesAgentIn: string | undefined;
}

export function FilterMerchantsContent({
  dateFromIn,
  establishmentIn,
  statusIn,
  stateIn,
  emailIn,
  cnpjIn,
  activeIn,
  salesAgentIn,
  onFilter,
  onClose,
  StatusKyc,
}: FilterMerchantsContentProps) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(dateFromIn);
  const [establishment, setEstablishment] = useState(establishmentIn || "");
  const [status, setStatus] = useState(statusIn || "all");
  const [state, setState] = useState(stateIn || "");
  const [email, setEmail] = useState(emailIn || "");
  const [cnpj, setCnpj] = useState(cnpjIn || "");
  const [active, setActive] = useState(activeIn || "");
  const [salesAgent, setSalesAgent] = useState(salesAgentIn || "");

  const activeOptions = [
    { value: "true", label: "Sim" },
    { value: "false", label: "Não" },
  ];

  const applyFilters = () => {
    onFilter({
      dateFrom,
      establishment,
      status,
      state,
      email,
      cnpj,
      active,
      salesAgent,
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
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      <div
        className="bg-background border rounded-lg p-6 shadow-xl min-w-[800px] max-w-[90vw] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Nome Fantasia */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Nome Fantasia</h3>
            <Input
              placeholder="Nome do estabelecimento"
              value={establishment}
              onChange={(e) => setEstablishment(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* CNPJ/CPF */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">CNPJ/CPF</h3>
            <Input
              placeholder="CNPJ ou CPF"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Email</h3>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Consultor Comercial */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Consultor Comercial</h3>
            <Input
              placeholder="Nome do consultor"
              value={salesAgent}
              onChange={(e) => setSalesAgent(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Estado</h3>
            <Input
              placeholder="Ex: SP, São Paulo, Rio de Janeiro, RJ..."
              value={state}
              onChange={(e) => setState(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Ativo */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Ativo</h3>
            <div className="flex items-center gap-4 mt-2">
              {activeOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`active-${option.value}`}
                    checked={active === option.value}
                    onCheckedChange={() =>
                      setActive(active === option.value ? "" : option.value)
                    }
                  />
                  <Label htmlFor={`active-${option.value}`}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Cadastrado em</h3>
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
                    {dateFrom
                      ? format(dateFrom, "dd/MM/yyyy")
                      : "Dia de cadastro"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0"
                  align="start"
                  onMouseDown={(e) => e.stopPropagation()}
                >
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

          {/* Status KYC */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Status KYC</h3>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent onMouseDown={(e) => e.stopPropagation()}>
                <SelectItem value="all">Todos</SelectItem>
                {StatusKyc &&
                  StatusKyc.map((statusOption) => (
                    <SelectItem
                      key={statusOption.value}
                      value={statusOption.value}
                    >
                      {statusOption.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
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
