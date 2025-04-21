"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { MerchantDD } from "@/features/anticipations/server/anticipation";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import { useState } from "react";

type AnticipationsListFilterContentProps = {
  merchantDD?: MerchantDD[];
  dateFromIn?: Date;
  dateToIn?: Date;
  merchantSlugIn?: string;
  typeIn?: string;
  statusIn?: string;
  onFilter: (filters: {
    dateFrom?: Date;
    dateTo?: Date;
    merchantSlug?: string;
    type?: string;
    status: string;
  }) => void;
  onClose: () => void;
};

export function AnticipationsListFilterContent({
  dateFromIn,
  dateToIn,
  merchantSlugIn,
  typeIn,
  statusIn,
  onFilter,
  onClose,
  merchantDD,
}: AnticipationsListFilterContentProps) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(dateFromIn);
  const [dateTo, setDateTo] = useState<Date | undefined>(dateToIn);
  const [merchantSlug, setMerchantSlug] = useState(merchantSlugIn || "all");
  const [type, setType] = useState(typeIn || "");
  const [status, setStatus] = useState(statusIn || "");

  const statuses = [
    {
      value: "pending",
      label: "Pendente",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      value: "approved",
      label: "Aprovado",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      value: "rejected",
      label: "Reprovado",
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      value: "cancelled",
      label: "Cancelado",
      color: "bg-gray-500 hover:bg-gray-600",
    },
    {
      value: "waiting",
      label: "Aguardando",
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
      value: "pre-approved",
      label: "Pré-Aprovado",
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
  ];

  const types = [
    {
      value: "CPN",
      label: "Cartão Não Presente",
    },
    {
      value: "CP",
      label: "Cartão Presente",
    },
    {
      value: "both",
      label: "Ambos",
    },
  ];

  return (
    <div className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[700px]">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Estabelecimento</h3>
            <Select value={merchantSlug} onValueChange={setMerchantSlug}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um estabelecimento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {merchantDD?.map((merchant) => (
                  <SelectItem
                    key={merchant.slug}
                    value={merchant.slug || "all"}
                  >
                    {merchant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Data de Liquidação</h3>
            <div className="flex flex-col gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "De"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "PPP") : "Até"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Tipo</h3>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <Badge
                key={t.value}
                variant="secondary"
                className={cn(
                  "cursor-pointer w-48 h-8 select-none bg-secondary text-secondary-foreground"
                )}
                onClick={() => setType(type === t.value ? "" : t.value)}
              >
                {t.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Status</h3>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
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

      <div className="flex justify-end pt-4 mt-4 border-t">
        <Button
          onClick={() => {
            onFilter({
              dateFrom,
              dateTo,
              merchantSlug,
              type,
              status,
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
