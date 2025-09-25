"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type FilterPaymentLinkContentProps = {
  identifierIn?: string;
  statusIn?: string;
  merchantIn?: string;
  onFilter: (filters: {
    identifier: string;
    status: string;
    merchant: string;
  }) => void;
  onClose: () => void;
};

export function FilterPaymentLinkContent({
                                           identifierIn,
                                           statusIn,
                                           merchantIn,
                                           onFilter,
                                           onClose,
                                         }: FilterPaymentLinkContentProps) {
  const [identifier, setIdentifier] = useState(identifierIn || "");
  const [status, setStatus] = useState(statusIn || "");
  const [merchant, setMerchant] = useState(merchantIn || "");

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

    // Aqui use o KeyboardEvent global, não do React
    const handleKeyDownGlobal = (e: KeyboardEvent) => {
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

  const statuses = [
    {
      value: "PAID",
      label: "Pago",
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
    {
      value: "PENDING",
      label: "Pendente",
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
      value: "EXPIRED",
      label: "Expirado",
      color: "bg-gray-500 hover:bg-gray-600",
    },
    {
      value: "CANCELED",
      label: "Cancelado",
      color: "bg-red-500 hover:bg-red-600",
    },
  ];

  const applyFilters = () => {
    onFilter({ identifier, status, merchant });
    onClose();
  };

  // Aqui, dentro de inputs React, use React.KeyboardEvent
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
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
            className="bg-background border rounded-lg p-6 shadow-xl min-w-[900px] max-w-[90vw] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Identificador do link</h3>
              <Input
                  placeholder="Identificador do link"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onKeyDown={handleKeyDown}
              />
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
                            status === s.value ? "text-white" : "text-secondary-foreground"
                        )}
                        onClick={() => setStatus(status === s.value ? "" : s.value)}
                    >
                      {s.label}
                    </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Estabelecimento</h3>
              <Input
                  placeholder="Nome do estabelecimento"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
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
      </div>
  );
}
