"use client";

import { useEffect, useState } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DailyAmount,
  GlobalSettlementResult,
  getMerchantAgendaTotal,
} from "../server/merchantAgenda";
import { Calendar } from "./calendar";
import { DailyView } from "./dailyView";
import ListFilter from "./receiptsFilter";

// Exemplo de dados - substitua pelos dados reais da sua aplicação

export default function MerchantAgendaReceipts({
  monthlyData,
  dailyData,
}: {
  monthlyData: DailyAmount[];
  dailyData: GlobalSettlementResult;
}) {
  const [view, setView] = useState("month");
 

  const [monthTotal, setMonthTotal] = useState<number>(0);
  const [actualDate, setActualDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchTotalAmountByMonth = async () => {
      try {
        const totalAmountByMonth = (await getMerchantAgendaTotal(
          actualDate
        )) as number;
        setMonthTotal(totalAmountByMonth || 0);
      } catch (error) {
        console.error("Failed to fetch total amount by month:", error);
      }
    };

    fetchTotalAmountByMonth();
  }, [actualDate]);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <ToggleGroup
        type="single"
        value={view}
        onValueChange={(v) => v && setView(v)}
      >
        <ToggleGroupItem value="month">Mês</ToggleGroupItem>
        <ToggleGroupItem value="day">Dia</ToggleGroupItem>
      </ToggleGroup>
      <div className="flex items-center gap-4">
        <ListFilter
          linkHref="/portal/portal/receipts"
          CalendarView={view == "month"}
        ></ListFilter>
      </div>

      <div className="text-sm text-muted-foreground">
        {view === "month" ? "TOTAL RECEBIDO NO MÊS" : "TOTAL LIQUIDADO NO DIA"}
      </div>
      <div className="text-2xl font-bold text-primary">
        {new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(
          view === "month" ? Number(monthTotal) : dailyData.globalSettlement
        )}
      </div>

      {view === "month" ? (
        <Calendar monthlyData={monthlyData} handleMonthChange={setActualDate} />
      ) : (
        <DailyView dailyData={dailyData} />
      )}
    </div>
  );
}
