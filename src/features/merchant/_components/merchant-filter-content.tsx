"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusKyc } from "@/lib/lookuptables/lookuptables";
import { Search } from "lucide-react";
import { KeyboardEvent, useState } from "react";

type FilterMerchantsContentProps = {
  dateFromIn?: Date;
  establishmentIn?: string;
  statusIn?: string;
  stateIn?: string;
  emailIn?: string;
  cnpjIn?: string;
  activeIn?: string;
  salesAgentIn?: string;
  onFilter: (filters: {
    dateFrom?: Date;
    establishment: string;
    status: string;
    state: string;
    email: string;
    cnpj: string;
    active: string;
    salesAgent: string;
  }) => void;
  onClose: () => void;
};

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
      className="mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[1100px]"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Primeira linha */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Nome Fantasia</h3>
          <Input
            placeholder="Nome do estabelecimento"
            value={establishment}
            onChange={(e) => setEstablishment(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">CNPJ/CPF</h3>
          <Input
            placeholder="CNPJ ou CPF"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

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

        {/* Segunda linha */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Consultor Comercial</h3>
          <Input
            placeholder="Nome do consultor"
            value={salesAgent}
            onChange={(e) => setSalesAgent(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Estado (UF)</h3>
          <Input
            placeholder="UF"
            value={state}
            onChange={(e) => setState(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={2}
            className="uppercase"
          />
        </div>

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
                <Label htmlFor={`active-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Terceira linha */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Cadastrado Em</h3>
          <Input
            type="date"
            value={dateFrom ? dateFrom.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              setDateFrom(e.target.value ? new Date(e.target.value) : undefined)
            }
            onKeyDown={handleKeyDown}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Status KYC</h3>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent>
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
  );
}
