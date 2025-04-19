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
import { Search } from "lucide-react";
import { KeyboardEvent, useState } from "react";

type LegalNatureFilterContentProps = {
  nameIn?: string;
  codeIn?: string;
  activeIn?: string;
  onFilter: (filters: { name: string; code: string; active: string }) => void;
  onClose: () => void;
};

export function LegalNatureFilterContent({
  nameIn,
  codeIn,
  activeIn,
  onFilter,
  onClose,
}: LegalNatureFilterContentProps) {
  const [name, setName] = useState(nameIn || "");
  const [code, setCode] = useState(codeIn || "");
  const [active, setActive] = useState(activeIn || "");

  const statuses = [
    { value: "true", label: "Ativo" },
    { value: "false", label: "Inativo" },
  ];

  const handleStatusChange = (value: string) => {
    setActive(value === "all" ? "" : value);
  };

  const applyFilters = () => {
    onFilter({ name, code, active });
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
      className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md w-[600px]"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-medium mb-1.5">Nome</div>
          <Input
            placeholder="Nome da natureza jurídica"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-9"
          />
        </div>

        <div className="flex flex-col">
          <div className="text-xs font-medium mb-1.5">Código</div>
          <div className="flex">
            <Input
              placeholder="Código"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-9 w-32"
            />
          </div>
        </div>

        <div>
          <div className="text-xs font-medium mb-1.5">Status</div>
          <Select value={active || "all"} onValueChange={handleStatusChange}>
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
