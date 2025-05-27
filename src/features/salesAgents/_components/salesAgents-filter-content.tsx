"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import {KeyboardEvent, useEffect, useRef, useState} from "react";

type FilterSalesAgentsContentProps = {
  dateFromIn?: Date;
  dateToIn?: Date;
  nameIn?: string;
  statusIn?: string;
  emailIn?: string;
  onFilter: (filters: {
    dateFrom?: Date;
    dateTo?: Date;
    name: string;
    status: string;
    email: string;
  }) => void;
  onClose: () => void;
};

export function SalesAgentsFilterContent({
  dateFromIn,
  dateToIn,
  nameIn,
  statusIn,
  emailIn,
  onFilter,
  onClose,
}: FilterSalesAgentsContentProps) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(dateFromIn);
  const [dateTo, setDateTo] = useState<Date | undefined>(dateToIn);
  const [name, setName] = useState(nameIn || "");
  const [status, setStatus] = useState(statusIn || "");
  const [email, setEmail] = useState(emailIn || "");


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
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
    {
      value: "INACTIVE",
      label: "Inativo",
      color: "bg-red-500 hover:bg-red-600",
    },
  ];

  const applyFilters = () => {
    onFilter({ dateFrom, dateTo, name, status, email });
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
    <div ref={filterRef}
      className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[900px] z-60"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Nome do Consultor</h3>
          <Input
            placeholder="Nome do consultor"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Email</h3>
          <Input
            placeholder="Email do consultor"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <Input
            type="date"
            value={dateFrom ? dateFrom.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              setDateFrom(e.target.value ? new Date(e.target.value) : undefined)
            }
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Data Final</h3>
          <Input
            type="date"
            value={dateTo ? dateTo.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              setDateTo(e.target.value ? new Date(e.target.value) : undefined)
            }
            onKeyDown={handleKeyDown}
          />
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
