"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Search } from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {format, parseISO} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import { cn } from "@/lib/utils";


type MerchantAgendaFilterContentProps = {
  merchant?: string;
  date?: string;
  view: "month" | "day";
  onFilter: (filters: { merchant: string; date: string }) => void;
  onClose: () => void;
};

export function MerchantAgendaReceiptsFilterContent({
  merchant,
  date,
  onClose,
  onFilter,
  view,
}: MerchantAgendaFilterContentProps) {
  const [merchantInput, setMerchantInput] = useState(merchant || "");
  const [dateInput, setDateInput] = useState(date || "");

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

  return (
    <div ref={filterRef} className="relative mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[1100px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Estabelecimento</h3>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nome do estabelecimento"
              className="pl-8"
              value={merchantInput}
              onChange={(e) => setMerchantInput(e.target.value)}
            />
          </div>
        </div>
        {view === "day" && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Data</h3>
              <div className="flex flex-col gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="relative w-full">
                      <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Button
                          variant="outline"
                          className={cn(
                              "w-full pl-8 text-left font-normal h-10",
                              !dateInput && "text-muted-foreground"
                          )}
                      >
                        {dateInput ? format(parseISO(dateInput), "dd/MM/yyyy") : "Selecionar data"}
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
                        selected={dateInput ? parseISO(dateInput) : undefined}
                        onSelect={(date) => {
                          if (date) setDateInput(date.toISOString().split("T")[0]);
                        }}
                        initialFocus
                        toDate={new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
        )}
      </div>



      <div className="flex justify-end pt-4 mt-4 border-t">
        <Button
          onClick={() => {
            onFilter({
              merchant: merchantInput || "",
              date: dateInput || "",
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
