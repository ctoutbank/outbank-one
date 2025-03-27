"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";

type ReportsFilterContentProps = {
  searchIn?: string;
  typeIn?: string;
  formatIn?: string;
  recurrenceIn?: string;
  periodIn?: string;
  emailIn?: string;
  creationDateIn?: Date;
  onFilter: (filters: {
    search: string;
    type: string;
    format: string;
    recurrence: string;
    period: string;
    email: string;
    creationDate?: Date;
  }) => void;
  onClose: () => void;
};

export function ReportsFilterContent({
  searchIn,
  typeIn,
  formatIn,
  recurrenceIn,
  periodIn,
  emailIn,
  creationDateIn,
  onFilter,
  onClose,
}: ReportsFilterContentProps) {
  const [search, setSearch] = useState(searchIn || "");
  const [type, setType] = useState(typeIn || "");
  const [format, setFormat] = useState(formatIn || "");
  const [recurrence, setRecurrence] = useState(recurrenceIn || "");
  const [period, setPeriod] = useState(periodIn || "");
  const [email, setEmail] = useState(emailIn || "");
  const [creationDate, setCreationDate] = useState<Date | undefined>(creationDateIn);

  // Dados estáticos para os filtros
  const types = [
    { code: "FINANCIAL", name: "Financeiro" },
    { code: "OPERATIONAL", name: "Operacional" },
    { code: "ADMINISTRATIVE", name: "Administrativo" },
    { code: "SALES", name: "Vendas" },
    { code: "MARKETING", name: "Marketing" }
  ];
  
  const formats = [
    { code: "PDF", name: "PDF" },
    { code: "EX", name: "Excel" },
    { code: "CSV", name: "CSV" },
    { code: "TXT", name: "Texto" }
  ];
  
  const recurrences = [
    { code: "DIA", name: "Diário" },
    { code: "SEM", name: "Semanal" },
    { code: "MES", name: "Mensal" },
    { code: "TRI", name: "Trimestral" }
    
  ];
  
  const periods = [
    { code: "day", name: "Dia" },
    { code: "week", name: "Semana" },
    { code: "month", name: "Mês" },
    { code: "quarter", name: "Trimestre" },
    { code: "year", name: "Ano" }
  ];

  // Definir cores para cada tipo de filtro
  const typeColors: Record<string, string> = {
    "FINANCIAL": "bg-blue-500 hover:bg-blue-600",
    "OPERATIONAL": "bg-green-500 hover:bg-green-600",
    "ADMINISTRATIVE": "bg-purple-500 hover:bg-purple-600",
    "SALES": "bg-amber-500 hover:bg-amber-600",
    "MARKETING": "bg-indigo-500 hover:bg-indigo-600"
  };
  
  const formatColors: Record<string, string> = {
    "pdf": "bg-red-500 hover:bg-red-600",
    "excel": "bg-green-500 hover:bg-green-600",
    "csv": "bg-blue-500 hover:bg-blue-600"
  };
  
  const recurrenceColors: Record<string, string> = {
    "daily": "bg-blue-500 hover:bg-blue-600",
    "weekly": "bg-purple-500 hover:bg-purple-600",
    "monthly": "bg-emerald-500 hover:bg-emerald-600",
    "quarterly": "bg-orange-500 hover:bg-orange-600",
    "yearly": "bg-red-500 hover:bg-red-600",
    "once": "bg-gray-500 hover:bg-gray-600"
  };
  
  const periodColors: Record<string, string> = {
    "day": "bg-yellow-500 hover:bg-yellow-600",
    "week": "bg-orange-500 hover:bg-orange-600",
    "month": "bg-teal-500 hover:bg-teal-600",
    "quarter": "bg-indigo-500 hover:bg-indigo-600",
    "year": "bg-pink-500 hover:bg-pink-600"
  };

  const getColorForType = (code: string) => typeColors[code] || "bg-gray-500 hover:bg-gray-600";
  const getColorForFormat = (code: string) => formatColors[code] || "bg-gray-500 hover:bg-gray-600";
  const getColorForRecurrence = (code: string) => recurrenceColors[code] || "bg-gray-500 hover:bg-gray-600";
  const getColorForPeriod = (code: string) => periodColors[code] || "bg-gray-500 hover:bg-gray-600";

  return (
    <div className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[1100px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Título do Relatório</h3>
          <Input
            placeholder="Título do relatório"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Email</h3>
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Data de Criação</h3>
          <Input
            type="date"
            value={creationDate ? creationDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setCreationDate(e.target.value ? new Date(e.target.value) : undefined)}
          />
        </div>

        <div className="space-y-2 ml-2">
          <h3 className="text-sm font-medium ml-2">Tipo de Relatório</h3>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <Badge
                key={t.code}
                variant="secondary"
                className={cn(
                  "cursor-pointer w-auto px-3 py-1 select-none text-sm",
                  type === t.code ? getColorForType(t.code) : "bg-secondary",
                  type === t.code ? "text-white" : "text-secondary-foreground"
                )}
                onClick={() => setType(type === t.code ? "" : t.code)}
              >
                {t.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2 ml-2">
          <h3 className="text-sm font-medium ml-2">Formato</h3>
          <div className="flex flex-wrap gap-2">
            {formats.map((f) => (
              <Badge
                key={f.code}
                variant="secondary"
                className={cn(
                  "cursor-pointer w-auto px-3 py-1 select-none text-sm",
                  format === f.code ? getColorForFormat(f.code) : "bg-secondary",
                  format === f.code ? "text-white" : "text-secondary-foreground"
                )}
                onClick={() => setFormat(format === f.code ? "" : f.code)}
              >
                {f.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2 ml-2">
          <h3 className="text-sm font-medium ml-2">Recorrência</h3>
          <div className="flex flex-wrap gap-2">
            {recurrences.map((r) => (
              <Badge
                key={r.code}
                variant="secondary"
                className={cn(
                  "cursor-pointer w-auto px-3 py-1 select-none text-sm",
                  recurrence === r.code ? getColorForRecurrence(r.code) : "bg-secondary",
                  recurrence === r.code ? "text-white" : "text-secondary-foreground"
                )}
                onClick={() => setRecurrence(recurrence === r.code ? "" : r.code)}
              >
                {r.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2 ml-2">
          <h3 className="text-sm font-medium ml-2">Período</h3>
          <div className="flex flex-wrap gap-2">
            {periods.map((p) => (
              <Badge
                key={p.code}
                variant="secondary"
                className={cn(
                  "cursor-pointer w-auto px-3 py-1 select-none text-sm",
                  period === p.code ? getColorForPeriod(p.code) : "bg-secondary",
                  period === p.code ? "text-white" : "text-secondary-foreground"
                )}
                onClick={() => setPeriod(period === p.code ? "" : p.code)}
              >
                {p.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t">
        <Button 
          onClick={() => {
            onFilter({ search, type, format, recurrence, period, email, creationDate });
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