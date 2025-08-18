"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import { useState } from "react";

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

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      <div
        className="bg-background border rounded-lg p-6 shadow-xl min-w-[800px] max-w-[90vw] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
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
                        {dateInput
                          ? format(parseISO(dateInput), "dd/MM/yyyy")
                          : "dd/mm/aaaa"}
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 z-[60]"
                    align="start"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <Calendar
                      mode="single"
                      selected={dateInput ? parseISO(dateInput) : undefined}
                      onSelect={(date) => {
                        if (date)
                          setDateInput(date.toISOString().split("T")[0]);
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
    </div>
  );
}
