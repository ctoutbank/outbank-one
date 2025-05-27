"use client";

import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import {useEffect, useRef, useState} from "react";

type AnticipationsListFilterContentProps = {
  settlementDateFromIn?: Date;
  settlementDateToIn?: Date;
  saleDateFromIn?: Date;
  saleDateToIn?: Date;
  establishmentIn?: string;
  nsuIn?: string;
  statusIn?: string;
  orderIdIn?: string;
  onFilter: (filters: {
    settlementDateFrom?: Date;
    settlementDateTo?: Date;
    saleDateFrom?: Date;
    saleDateTo?: Date;
    establishment?: string;
    nsu?: string;
    status: string;
    orderId?: string;
  }) => void;
  onClose: () => void;
};

export function AnticipationsListFilterContent({
  settlementDateFromIn,
  settlementDateToIn,
  saleDateFromIn,
  saleDateToIn,
  establishmentIn,
  nsuIn,
  statusIn,
  orderIdIn,
  onFilter,
  onClose,
}: AnticipationsListFilterContentProps) {
  const [settlementDateFrom, setSettlementDateFrom] = useState<
    Date | undefined
  >(settlementDateFromIn);
  const [settlementDateTo, setSettlementDateTo] = useState<Date | undefined>(
    settlementDateToIn
  );
  const [saleDateFrom, setSaleDateFrom] = useState<Date | undefined>(
    saleDateFromIn
  );
  const [saleDateTo, setSaleDateTo] = useState<Date | undefined>(saleDateToIn);
  const [establishment, setEstablishment] = useState(establishmentIn || "");
  const [nsu, setNsu] = useState(nsuIn || "");
  const [status, setStatus] = useState(statusIn || "");
  const [orderId, setOrderId] = useState(orderIdIn || "");


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
      value: "fully-anticipated",
      label: "Totalmente Antecipadas",
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
    {
      value: "partially-anticipated",
      label: "Parcialmente Antecipadas",
      color: "bg-amber-500 hover:bg-amber-600",
    },
  ];

  // Mock data for establishments
  const establishments = [
    { id: "1", name: "Estabelecimento A" },
    { id: "2", name: "Estabelecimento B" },
    { id: "3", name: "Estabelecimento C" },
    { id: "4", name: "Estabelecimento D" },
    { id: "5", name: "Estabelecimento E" },
  ];

  return (
    <div ref={filterRef} className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[800px] min-h-[450px] max-h-[450px]">
      <div className="space-y-4">
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Data de Liquidação</h3>
            <div className="flex flex-col gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !settlementDateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {settlementDateFrom
                      ? format(settlementDateFrom, "PPP")
                      : "De"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" onMouseDown={(e) => e.stopPropagation()}>
                  <Calendar
                    mode="single"
                    selected={settlementDateFrom}
                    onSelect={setSettlementDateFrom}
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
                      !settlementDateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {settlementDateTo ? format(settlementDateTo, "PPP") : "Até"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" onMouseDown={(e) => e.stopPropagation()}>
                  <Calendar
                    mode="single"
                    selected={settlementDateTo}
                    onSelect={setSettlementDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Data de Venda</h3>
            <div className="flex flex-col gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !saleDateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {saleDateFrom ? format(saleDateFrom, "PPP") : "De"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" onMouseDown={(e) => e.stopPropagation()}>
                  <Calendar
                    mode="single"
                    selected={saleDateFrom}
                    onSelect={setSaleDateFrom}
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
                      !saleDateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {saleDateTo ? format(saleDateTo, "PPP") : "Até"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" onMouseDown={(e) => e.stopPropagation()}>
                  <Calendar
                    mode="single"
                    selected={saleDateTo}
                    onSelect={setSaleDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Estabelecimento</h3>
            <Select value={establishment} onValueChange={setEstablishment}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um estabelecimento" />
              </SelectTrigger>
              <SelectContent onMouseDown={(e) => e.stopPropagation()}>
                <SelectItem value="all">Todos</SelectItem>
                {establishments.map((est) => (
                  <SelectItem key={est.id} value={est.id}>
                    {est.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">NSU</h3>
            <Input
              placeholder="Digite o NSU"
              value={nsu}
              onChange={(e) => setNsu(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Id do Pedido</h3>
          <Input
            placeholder="Digite o ID do pedido"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t">
        <Button
          onClick={() => {
            onFilter({
              settlementDateFrom,
              settlementDateTo,
              saleDateFrom,
              saleDateTo,
              establishment,
              nsu,
              status,
              orderId,
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
