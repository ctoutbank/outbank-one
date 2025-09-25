"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
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
import { adjustmentTypes } from "@/lib/lookuptables/lookuptables-adjustment";
import { cn } from "@/lib/utils";
import { format as formatDate } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type FinancialAdjustmentsFilterContentProps = {
  searchIn?: string;
  typeIn?: string;
  reasonIn?: string;
  activeIn?: string;
  creationDateIn?: Date;
  onFilter: (filters: {
    search: string;
    type: string;
    reason: string;
    active: string;
    creationDate?: Date;
  }) => void;
  onClose: () => void;
};

export function FinancialAdjustmentsFilterContent({
  searchIn,
  typeIn,
  reasonIn,
  activeIn,
  creationDateIn,
  onFilter,
  onClose,
}: FinancialAdjustmentsFilterContentProps) {
  const [search, setSearch] = useState(searchIn || "");
  const [type, setType] = useState(typeIn || "");
  const [reason, setReason] = useState(reasonIn || "");
  const [active, setActive] = useState(activeIn || "");
  const [creationDate, setCreationDate] = useState<Date | undefined>(
    creationDateIn
  );

  const filterRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    const handleKeyDownGlobal = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDownGlobal);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDownGlobal);
    };
  }, [onClose, handleClickOutside]);

  // Função para aplicar os filtros e fechar o modal
  const applyFilters = () => {
    onFilter({
      search,
      type,
      reason,
      active,
      creationDate,
    });
    onClose();
  };

  // Handler para a tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
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
        ref={filterRef}
        className="bg-background border rounded-lg p-6 shadow-xl min-w-[800px] max-w-[95vw] max-h-[90vh] overflow-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs font-medium mb-1.5">Título</div>
            <Input
              placeholder="Título ou descrição..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-9"
            />
          </div>
          <div>
            <div className="text-xs font-medium mb-1.5">Tipo</div>
            <Select
              value={type || "all"}
              onValueChange={(value) => setType(value === "all" ? "" : value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent onMouseDown={(e) => e.stopPropagation()}>
                <SelectItem value="all">Todos</SelectItem>
                {adjustmentTypes.map((adjustmentType) => (
                  <SelectItem
                    key={adjustmentType.value}
                    value={adjustmentType.value}
                  >
                    {adjustmentType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="text-xs font-medium mb-1.5">Motivo</div>
            <Input
              placeholder="Digite o motivo..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-9"
            />
          </div>
          <div>
            <div className="text-xs font-medium mb-1.5">Status</div>
            <Select
              value={active || "all"}
              onValueChange={(value) => setActive(value === "all" ? "" : value)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent onMouseDown={(e) => e.stopPropagation()}>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Ativo</SelectItem>
                <SelectItem value="false">Inativo</SelectItem>
              </SelectContent>
            </Select>
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
                    {creationDate
                      ? formatDate(creationDate, "dd/MM/yyyy")
                      : "Selecionar data"}
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
    </div>
  );
}
