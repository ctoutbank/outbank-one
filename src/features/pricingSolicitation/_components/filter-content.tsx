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

  const applyFilters = () => {
    onFilter({ cnae, status });
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
      ref={filterRef}
      className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[900px]"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Identificador do link</h3>
          <Input
            placeholder="CNAE"
            value={cnae}
            onChange={(e) => setCnae(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="space-y-2 ml-8">
          <h3 className="text-sm font-medium ml-2">Status</h3>
          <div className="flex flex-wrap gap-2">
            {PricingSolicitationStatus.map((s) => (
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
