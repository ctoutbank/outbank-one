"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";

type TerminalsFilterContentProps = {
  dateFromIn?: Date;
  dateToIn?: Date;
  numeroLogicoIn?: string;
  numeroSerialIn?: string;
  estabelecimentoIn?: string;
  modeloIn?: string;
  statusIn?: string;
  provedorIn?: string;
  onFilter: (filters: {
    dateFrom?: Date;
    dateTo?: Date;
    numeroLogico: string;
    numeroSerial: string;
    estabelecimento: string;
    modelo: string;
    status: string;
    provedor: string;
  }) => void;
  onClose: () => void;
};

export function TerminalsFilterContent({
  dateFromIn,
  dateToIn,
  numeroLogicoIn,
  numeroSerialIn,
  estabelecimentoIn,
  modeloIn,
  statusIn,
  provedorIn,
  onFilter,
  onClose,
}: TerminalsFilterContentProps) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(dateFromIn);
  const [dateTo, setDateTo] = useState<Date | undefined>(dateToIn);
  const [numeroLogico, setNumeroLogico] = useState(numeroLogicoIn || "");
  const [numeroSerial, setNumeroSerial] = useState(numeroSerialIn || "");
  const [estabelecimento, setEstabelecimento] = useState(
    estabelecimentoIn || ""
  );
  const [modelo, setModelo] = useState(modeloIn || "");
  const [status, setStatus] = useState(statusIn || "");
  const [provedor, setProvedor] = useState(provedorIn || "");

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
    {
      value: "MAINTENANCE",
      label: "Manutenção",
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
  ];

  return (
    <div className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[1100px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Número Lógico</h3>
          <Input
            placeholder="Número lógico"
            value={numeroLogico}
            onChange={(e) => setNumeroLogico(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Número Serial</h3>
          <Input
            placeholder="Número serial"
            value={numeroSerial}
            onChange={(e) => setNumeroSerial(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Provedor</h3>
          <Input
            placeholder="Provedor"
            value={provedor}
            onChange={(e) => setProvedor(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Estabelecimento</h3>
          <Input
            placeholder="Estabelecimento"
            value={estabelecimento}
            onChange={(e) => setEstabelecimento(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Modelo</h3>
          <Input
            placeholder="Modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
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
                  "cursor-pointer select-none text-sm px-3 py-1",
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
          <h3 className="text-sm font-medium">Data de Inclusão</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <h4 className="text-xs text-muted-foreground mb-1">De</h4>
              <Input
                type="date"
                value={dateFrom ? dateFrom.toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  setDateFrom(
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
              />
            </div>
            <div>
              <h4 className="text-xs text-muted-foreground mb-1">Até</h4>
              <Input
                type="date"
                value={dateTo ? dateTo.toISOString().split("T")[0] : ""}
                onChange={(e) =>
                  setDateTo(
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t">
        <Button
          onClick={() => {
            onFilter({
              dateFrom,
              dateTo,
              numeroLogico,
              numeroSerial,
              estabelecimento,
              modelo,
              status,
              provedor,
            });
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
