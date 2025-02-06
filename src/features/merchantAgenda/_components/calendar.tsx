"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Calendar } from "@/components/calendar";
import { DailyView } from "@/components/dailyView";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Sample data - replace with your actual data
const sampleEvents = [
  {
    title: "Recebíveis",
    date: "2025-02-06",
    extendedProps: {
      amount: 92910.06,
    },
  },
];

const sampleTransactions = [
  {
    id: "1",
    name: "Posto Santa Monica",
    totalGross: 666.66,
    totalNet: 666.66,
    details: [
      {
        type: "Débito",
        gross: 642.94,
        net: 628.19,
      },
      {
        type: "Débito - Pré-Pago",
        gross: 28.78,
        net: 28.47,
      },
    ],
  },
];

export default function FinancialPage() {
  const [view, setView] = useState("month");
  const [search, setSearch] = useState("");

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Busque por um estabelecimento"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && setView(v)}
        >
          <ToggleGroupItem value="month">Mês</ToggleGroupItem>
          <ToggleGroupItem value="day">Dia</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="text-sm text-muted-foreground">
        {view === "month" ? "TOTAL RECEBIDO NO MÊS" : "TOTAL LIQUIDADO NO DIA"}
      </div>
      <div className="text-2xl font-bold text-primary">
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(view === "month" ? 614408.24 : 92910.06)}
      </div>

      {view === "month" ? (
        <Calendar events={sampleEvents} />
      ) : (
        <DailyView transactions={sampleTransactions} />
      )}
    </div>
  );
}
