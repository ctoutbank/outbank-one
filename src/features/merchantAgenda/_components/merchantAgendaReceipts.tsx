"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import MerchantAgendaReceiptsTotal from "@/features/merchantAgenda/_components/merchantAgenda-receipts-total";
import {
  type DailyAmount,
  ExcelDailyData,
  type GlobalSettlementResult,
  getMerchantAgendaExcelDailyData,
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
  const [excelData, setExcelData] = useState<ExcelDailyData[]>();
  const [monthStatus, setMonthStatus] = useState<string>();

  useEffect(() => {
    const fetchExcelData = async () => {
      try {
        const date = searchParams?.get("date");

        console.log(date);
        const data = await getMerchantAgendaExcelDailyData(
          date == undefined || date == "" || date == null
            ? new Date().toISOString()
            : date
        );

        setExcelData(data);
      } catch (error) {
        console.error("Error fetching excel data:", error);
      }
    };

    fetchExcelData();
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const monthData = await getMerchantAgendaTotal(actualDate);
        setMonthTotal((monthData && Number(monthData[0].total)) || 0);
        setMonthStatus((monthData && monthData[0].status) || "SETTLED");

        const receipts = await getMerchantAgendaReceipts(null, actualDate);

        const dailyAmounts: DailyAmount[] = receipts
          .map((receipt) => ({
            date: String(receipt.day),
            amount: Number(receipt.totalAmount) || 0,
            status: String(receipt.status),
            is_anticipation: receipt.is_anticipation,
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
        <div className="flex items-center gap-4 w-full mb-4">
          <MerchantAgendaReceiptsFilter
            merchant={searchParams?.get("search") || undefined}
            date={searchParams?.get("date") || undefined}
            view={view as "month" | "day"}
          />
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(v) => v && setView(v)}
            className="border bg-white rounded-lg h-8 w-full"
          >
            <ToggleGroupItem value="month" className="w-[200px]">
              Visualização por Mês
            </ToggleGroupItem>
            <ToggleGroupItem value="day" className="w-[200px]">
              Visualização por Dia
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {view === "day" && (
        <div className="mb-4">
          <MerchantAgendaReceiptsTotal
            merchantAgendaReceiptsTotalProps={{
              total: dailyData.globalSettlement - dailyData.globalAdjustments,
              view: "day",
              status: dailyData.status,
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
          setView={setView}
          status={monthStatus || ""}
        />
      ) : (
        <DailyView
          dailyData={dailyData}
          exportExcelDailyData={excelData ?? []}
        />
      )}
    </div>
  );
}
