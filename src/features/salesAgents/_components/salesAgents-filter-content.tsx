"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CalendarIcon, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { KeyboardEvent, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

type FilterSalesAgentsContentProps = {
  dateFromIn?: Date;
  dateToIn?: Date;
  nameIn?: string;
  statusIn?: string;
  emailIn?: string;
  onFilter: (filters: {
    dateFrom?: Date;
    dateTo?: Date;
    name: string;
    status: string;
    email: string;
  }) => void;
  onClose: () => void;
};

export function SalesAgentsFilterContent({
                                           dateFromIn,
                                           dateToIn,
                                           nameIn,
                                           statusIn,
                                           emailIn,
                                           onFilter,
                                           onClose,
                                         }: FilterSalesAgentsContentProps) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(dateFromIn);
  const [dateTo, setDateTo] = useState<Date | undefined>(dateToIn);
  const [name, setName] = useState(nameIn || "");
  const [status, setStatus] = useState(statusIn || "");
  const [email, setEmail] = useState(emailIn || "");

  const statuses = [
    { value: "ACTIVE", label: "Ativo", color: "bg-emerald-500 hover:bg-emerald-600" },
    { value: "INACTIVE", label: "Inativo", color: "bg-red-500 hover:bg-red-600" },
  ];

  const applyFilters = () => {
    onFilter({ dateFrom, dateTo, name, status, email });
    onClose();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
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
            className="bg-background border rounded-lg p-6 shadow-xl min-w-[900px] max-w-[90vw] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onKeyDown={handleKeyDown}
            tabIndex={0}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Nome do Consultor</h3>
              <Input
                  placeholder="Nome do consultor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyDown}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Email</h3>
              <Input
                  placeholder="Email do consultor"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
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
                            "cursor-pointer w-20 h-7 select-none text-sm",
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
              <h3 className="text-sm font-medium">Data de Cadastro</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                      variant="outline"
                      className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !dateFrom && "text-muted-foreground"
                      )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "PPP") : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0"
                    align="start"
                    onClick={(e) => e.stopPropagation()}
                >
                  <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={(selectedDate) => {
                        if (selectedDate) {
                          const startOfDay = new Date(selectedDate);
                          startOfDay.setHours(0, 0, 0, 0);

                          const endOfDay = new Date(selectedDate);
                          endOfDay.setHours(23, 59, 59, 999);

                          setDateFrom(startOfDay);
                          setDateTo(endOfDay);
                        } else {
                          setDateFrom(undefined);
                          setDateTo(undefined);
                        }
                      }}
                      initialFocus
                  />
                </PopoverContent>
              </Popover>
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
