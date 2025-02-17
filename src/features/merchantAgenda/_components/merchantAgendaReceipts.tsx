"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar } from "./calendar";
import { DailyView } from "./dailyView";
import {
  DailyAmount,
  GlobalSettlementResult,
  getMerchantAgendaTotal,
} from "../server/merchantAgenda";

// Exemplo de dados - substitua pelos dados reais da sua aplicação

export default function MerchantAgendaReceipts({
  monthlyData,
  dailyData,
}: {
  monthlyData: DailyAmount[];
  dailyData: GlobalSettlementResult;
}) {
  const [view, setView] = useState("month");
  const [search, setSearch] = useState("");

  const [monthTotal, setMonthTotal] = useState<Number>(0);
  const [actualDate, setActualDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchTotalAmountByMonth = async () => {
      try {
        const totalAmountByMonth = (await getMerchantAgendaTotal(
          actualDate
        )) as Number;
        setMonthTotal(totalAmountByMonth || 0);
      } catch (error) {
        console.error("Failed to fetch total amount by month:", error);
      }
    };

    fetchTotalAmountByMonth();
  }, [actualDate]);

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
        }).format(view === "month" ? Number(monthTotal) : dailyData.globalSettlement)}
      </div>

      {view === "month" ? (
        <Calendar monthlyData={monthlyData} handleMonthChange={setActualDate} />
      ) : (
        <DailyView dailyData={dailyData} />
      )}
    </div>
  );
}
