"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {CalendarIcon, Search } from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {Calendar} from "@/components/ui/calendar";
import { format as formatDate } from "date-fns"

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
    <div ref={filterRef} className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[1100px]">
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                  variant="outline"
                  className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                  )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? formatDate(new Date(date), "dd/MM/yyyy") : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                  mode="single"
                  selected={date ? new Date(date) : undefined}
                  onSelect={(selectedDate) => {
                    if (selectedDate) {
                      setDate(selectedDate.toISOString().split("T")[0]); // formata como yyyy-MM-dd
                    }
                  }}
                  initialFocus
              />
            </PopoverContent>
          </Popover>
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
