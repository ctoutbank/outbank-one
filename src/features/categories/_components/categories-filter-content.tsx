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
import {KeyboardEvent, useEffect, useRef, useState} from "react";

type CategoriesFilterContentProps = {
  nameIn?: string;
  statusIn?: string;
  mccIn?: string;
  cnaeIn?: string;
  onFilter: (filters: {
    name: string;
    status: string;
    mcc: string;
    cnae: string;
  }) => void;
  onClose: () => void;
};

export function CategoriesFilterContent({
  nameIn,
  statusIn,
  mccIn,
  cnaeIn,
  onFilter,
  onClose,
}: CategoriesFilterContentProps) {
  const [name, setName] = useState(nameIn || "");
  const [status, setStatus] = useState(statusIn || "");
  const [mcc, setMcc] = useState(mccIn || "");
  const [cnae, setCnae] = useState(cnaeIn || "");

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


  const statuses = [
    {
      value: "ACTIVE",
      label: "Ativo",
    },
    {
      value: "INACTIVE",
      label: "Inativo",
    },
  ];

  const applyFilters = () => {
    onFilter({ name, status, mcc, cnae });
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

  const handleStatusChange = (value: string) => {
    setStatus(value === "all" ? "" : value);
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
          <div className="text-xs font-medium mb-1.5">Nome da Categoria</div>
          <Input
            placeholder="Nome da categoria"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-9"
          />
        </div>

        <div>
          <div className="text-xs font-medium mb-1.5">MCC</div>
          <Input
            placeholder="MCC"
            value={mcc}
            onChange={(e) => setMcc(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-9 w-full"
          />
        </div>

        <div>
          <div className="text-xs font-medium mb-1.5">CNAE</div>
          <Input
            placeholder="CNAE"
            value={cnae}
            onChange={(e) => setCnae(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-9 w-full"
          />
        </div>

        <div>
          <div className="text-xs font-medium mb-1.5">Status</div>
          <Select value={status || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent onMouseDown={(e) => e.stopPropagation()}>
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
