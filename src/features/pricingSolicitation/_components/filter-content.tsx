"use client";

import { MultiSelect } from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PricingSolicitationStatus } from "@/lib/lookuptables/lookuptables";
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
  const [statusValues, setStatusValues] = useState<string[]>(
    statusIn ? statusIn.split(",").filter(Boolean) : []
  );

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
      status: statusValues.join(","),
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Status - Usando MultiSelect */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Status</h3>
            <MultiSelect
              options={PricingSolicitationStatus.filter(
                (s) => s.value !== "SEND_DOCUMENTS"
              ).map((s) => ({
                label: s.label,
                value: s.value,
              }))}
              onValueChange={setStatusValues}
              defaultValue={statusIn ? statusIn.split(",").filter(Boolean) : []}
              placeholder="Selecione os status"
              className="w-full"
              variant="secondary"
            />
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
