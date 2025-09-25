"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PricingSolicitationStatus } from "@/lib/lookuptables/lookuptables";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

type FilterPricingSolicitationContentProps = {
  cnaeIn?: string;
  statusIn?: string;
  onFilter: (filters: { cnae: string; status: string }) => void;
  onClose: () => void;
};

export function FilterPricingSolicitationContent({
  cnaeIn,
  statusIn,
  onFilter,
  onClose,
}: FilterPricingSolicitationContentProps) {
  const [cnae, setCnae] = useState(cnaeIn || "");
  const [status, setStatus] = useState(statusIn || "");

  const filterRef = useRef<HTMLDivElement>(null);

  // Fecha se clicar fora do conteúdo
  const handleClickOutside = (e: MouseEvent) => {
    if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Fecha ao apertar ESC
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
  }, [onClose]);

  const applyFilters = () => {
    onFilter({
      cnae,
      status,
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

  // Filtra os status removendo SEND_DOCUMENTS como no código original
  const availableStatuses = PricingSolicitationStatus.filter(
    (s) => s.value !== "SEND_DOCUMENTS"
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      <div
        ref={filterRef}
        className="bg-background border rounded-lg p-6 shadow-xl min-w-[900px] max-w-[90vw] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        tabIndex={0}
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

        <div className="space-y-4">
          {/* CNAE */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">CNAE</h3>
            <Input
              placeholder="Digite o CNAE"
              value={cnae}
              onChange={(e) => setCnae(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Status - Usando Badges como no filtro de antecipações */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Status</h3>
            <div className="flex flex-wrap gap-2">
              {availableStatuses.map((s) => (
                <Badge
                  key={s.value}
                  variant="secondary"
                  className={cn(
                    "cursor-pointer w-48 h-8 select-none",
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
        </div>

        <div className="flex justify-end pt-4 mt-6 border-t">
          <Button onClick={applyFilters} className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Filtrar
          </Button>
        </div>
      </div>
    </div>
  );
}
