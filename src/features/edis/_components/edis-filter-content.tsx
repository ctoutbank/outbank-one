"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";

type FilterEdisContentProps = {
  typeIn?: string;
  statusIn?: string;
  dateIn?: string;
  onFilter: (filters: { type: string; status: string; date: string }) => void;
  onClose: () => void;
};

export function FilterEdisContent({
  typeIn,
  statusIn,
  dateIn,
  onFilter,
  onClose,
}: FilterEdisContentProps) {
  const [type, setType] = useState(typeIn || "");
  const [status, setStatus] = useState(statusIn || "");
  const [date, setDate] = useState(dateIn || "");

  const statuses = [
    {
      value: "PROCESSED",
      label: "Processado",
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
    {
      value: "PENDING",
      label: "Pendente",
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    { value: "ERROR", label: "Erro", color: "bg-red-500 hover:bg-red-600" },
  ];

  const types = [
    {
      value: "REMESSA",
      label: "Remessa",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      value: "RETORNO",
      label: "Retorno",
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ];

  return (
    <div className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[1100px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium ml-2">Tipo de Arquivo</h3>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <Badge
                key={t.value}
                variant="secondary"
                className={cn(
                  "cursor-pointer w-24 h-7 select-none text-sm",
                  type === t.value ? t.color : "bg-secondary",
                  type === t.value ? "text-white" : "text-secondary-foreground"
                )}
                onClick={() => setType(type === t.value ? "" : t.value)}
              >
                {t.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2 ml-8">
          <h3 className="text-sm font-medium ml-2">Status</h3>
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
          <h3 className="text-sm font-medium">Data</h3>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t">
        <Button
          onClick={() => {
            onFilter({ type, status, date });
            onClose();
          }}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Filtrar
        </Button>
      </div>
    </div>
  );
}
