"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import MerchantAgendaReceiptsTotal from "@/features/merchantAgenda/_components/merchantAgenda-receipts-total";
import {
  type DailyAmount,
  type GlobalSettlementResult,
  getMerchantAgendaReceipts,
  getMerchantAgendaTotal,
} from "../server/merchantAgenda";
import { DailyView } from "./dailyView";
import { MerchantAgendaReceiptsFilter } from "./merchantAgenda-receipts-filter";
import { TableView } from "./table-view";

export default function MerchantAgendaReceipts({
  monthlyData: initialMonthlyData,
  dailyData,
}: {
  monthlyData: DailyAmount[];
  dailyData: GlobalSettlementResult;
}) {
  const searchParams = useSearchParams();
  const [view, setView] = useState("month");

  const [monthTotal, setMonthTotal] = useState<number>(0);
  const [actualDate, setActualDate] = useState<Date>(new Date());
  const [monthlyData, setMonthlyData] =
    useState<DailyAmount[]>(initialMonthlyData);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Busca o total do mês
        const totalAmountByMonth = (await getMerchantAgendaTotal(
          actualDate
        )) as number;
        setMonthTotal(totalAmountByMonth || 0);

        // Busca os dados diários para o mês
        const receipts = await getMerchantAgendaReceipts(null, actualDate);

        // Converte para o formato esperado pelo calendário
        const dailyAmounts: DailyAmount[] = receipts
          .map((receipt) => ({
            date: String(receipt.day),
            amount: Number(receipt.totalAmount) || 0,
          }))
          .filter((item) => item.amount > 0);

        setMonthlyData(dailyAmounts);
      } catch (error) {
        console.error("Falha ao buscar dados mensais:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [actualDate]);

  return (
    <div>
      <div className="flex justify-start w-[21rem]">
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && setView(v)}
          className="border bg-white rounded-lg h-8 mt-4 w-full"
        >
          <ToggleGroupItem value="month" className="w-1/2">
            Visualização por Mês
          </ToggleGroupItem>
          <ToggleGroupItem value="day" className="w-1/2">
            Visualização por Dia
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2 items-center my-4 ">
          <MerchantAgendaReceiptsFilter
            merchant={searchParams.get("search") || undefined}
            date={searchParams.get("date") || undefined}
            view={view as "month" | "day"}
          />
        </div>

      </div>
      {view === "day" && (
        <div className="mb-4">
          <MerchantAgendaReceiptsTotal
            merchantAgendaReceiptsTotalProps={{
              total: dailyData.globalSettlement,
              view: "day",
            }}
          />
        </div>
      )}
      {view === "month" ? (
        <TableView
          monthlyData={monthlyData}
          isLoading={isLoading}
          handleMonthChange={setActualDate}
          total={Number(monthTotal)}
          dailyData={dailyData}
        />
      ) : (
        <DailyView dailyData={dailyData} />
      )}
    </div>
  );
}
