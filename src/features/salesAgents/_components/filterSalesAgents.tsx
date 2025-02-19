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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, FilterIcon, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function FilterSalesAgents({
  dateFromIn,
  dateToIn,
  nameIn,
  statusIn,
  emailIn,
}: {
  dateFromIn?: Date;
  dateToIn?: Date;
  nameIn?: string;
  statusIn?: string;
  emailIn?: string;
}) {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(dateFromIn);
  const [dateTo, setDateTo] = useState<Date | undefined>(dateToIn);
  const [name, setName] = useState(nameIn || "");
  const [status, setStatus] = useState(statusIn || "");
  const [email, setEmail] = useState(emailIn || "");

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || "");

  const statuses = [
    { value: "ACTIVE", label: "Ativo", color: "bg-emerald-500 hover:bg-emerald-600" },
    { value: "INACTIVE", label: "Inativo", color: "bg-red-500 hover:bg-red-600" },
    { value: "PENDING", label: "Pendente", color: "bg-yellow-500 hover:bg-yellow-600" },
  ];

  const handleFilter = () => {
    if (dateFrom) {
      params.set("dateFrom", dateFrom.toISOString());
    } else {
      params.delete("dateFrom");
    }

    if (dateTo) {
      params.set("dateTo", dateTo.toISOString());
    } else {
      params.delete("dateTo");
    }

    if (name) {
      params.set("name", name);
    } else {
      params.delete("name");
    }

    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    if (email) {
      params.set("email", email);
    } else {
      params.delete("email");
    }

    params.set("page", "1");
    router.push(`?${params.toString()}`);
    setIsFiltersVisible(false);
  };

  const handleClearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setName("");
    setStatus("");
    setEmail("");
    params.delete("dateFrom");
    params.delete("dateTo");
    params.delete("name");
    params.delete("status");
    params.delete("email");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
    setIsFiltersVisible(false);
  };

  const activeFiltersCount =
    (dateFrom ? 1 : 0) +
    (dateTo ? 1 : 0) +
    (name ? 1 : 0) +
    (status ? 1 : 0) +
    (email ? 1 : 0);

  return (
    <div className="w-full space-y-2 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            className="flex items-center gap-2 mb-2 mt-2"
          >
            <FilterIcon className="h-4 w-4" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </Button>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              className="text-sm text-muted-foreground"
            >
              Limpar Filtros
            </Button>
          )}
        </div>
      </div>

      {isFiltersVisible && (
        <div className="bg-background border rounded-lg p-4 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Nome do Consultor</h3>
              <Input
                placeholder="Nome do consultor"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Email</h3>
              <Input
                placeholder="Email do consultor"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Status</h3>
              <div className="flex gap-2">
                {statuses.map((s) => (
                  <Badge
                    key={s.value}
                    variant="secondary"
                    className={cn(
                      "cursor-pointer w-20 h-9 select-none text-sm flex items-center justify-center",
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
                      {dateFrom ? format(dateFrom, "PPP") : "Data Inicial"}
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
                      {dateTo ? format(dateTo, "PPP") : "Data Final"}
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

          <div className="flex justify-start pt-4 mt-4 border-t">
            <Button onClick={handleFilter} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Filtrar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}