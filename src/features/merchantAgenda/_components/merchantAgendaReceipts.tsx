"use client"

import { useEffect, useState } from "react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  type DailyAmount,
  type GlobalSettlementResult,
  getMerchantAgendaReceipts,
  getMerchantAgendaTotal,
} from "../server/merchantAgenda"
import { Calendar } from "./calendar"
import { DailyView } from "./dailyView"
import { TableView } from "./table-view"
import ListFilter from "./receiptsFilter"

export default function MerchantAgendaReceipts({
  monthlyData: initialMonthlyData,
  dailyData,
}: {
  monthlyData: DailyAmount[]
  dailyData: GlobalSettlementResult
}) {
  const [view, setView] = useState("month")
  const [monthView, setMonthView] = useState<"calendar" | "table">("calendar")
  const [monthTotal, setMonthTotal] = useState<number>(0)
  const [actualDate, setActualDate] = useState<Date>(new Date())
  const [monthlyData, setMonthlyData] = useState<DailyAmount[]>(initialMonthlyData)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Busca o total do mês
        const totalAmountByMonth = (await getMerchantAgendaTotal(actualDate)) as number
        setMonthTotal(totalAmountByMonth || 0)

        // Busca os dados diários para o mês
        const receipts = await getMerchantAgendaReceipts(null, actualDate)

        // Converte para o formato esperado pelo calendário
        const dailyAmounts: DailyAmount[] = receipts
          .map((receipt) => ({
            date: String(receipt.day),
            amount: Number(receipt.totalAmount) || 0,
          }))
          .filter((item) => item.amount > 0)

        setMonthlyData(dailyAmounts)
      } catch (error) {
        console.error("Falha ao buscar dados mensais:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [actualDate])

  return (
    <div className="container mx-auto p-4 space-y-4">
      <ToggleGroup type="single" value={view} onValueChange={(v) => v && setView(v)}>
        <ToggleGroupItem value="month">Mês</ToggleGroupItem>
        <ToggleGroupItem value="day">Dia</ToggleGroupItem>
      </ToggleGroup>

      <div className="flex items-center gap-4">
        <ListFilter linkHref="/portal/portal/receipts" CalendarView={view == "month"}></ListFilter>

        {view === "month" && (
          <ToggleGroup
            type="single"
            value={monthView}
            onValueChange={(v) => v && setMonthView(v as "calendar" | "table")}
            className="ml-auto"
          >
            <ToggleGroupItem value="calendar">Calendário</ToggleGroupItem>
            <ToggleGroupItem value="table">Tabela</ToggleGroupItem>
          </ToggleGroup>
        )}
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
        monthView === "calendar" ? (
          <Calendar
            monthlyData={monthlyData}
            handleMonthChange={setActualDate}
            isLoading={isLoading}
            dailyData={dailyData}
          />
        ) : (
          <TableView monthlyData={monthlyData} isLoading={isLoading} handleMonthChange={setActualDate} />
        )
      ) : (
        <DailyView dailyData={dailyData} />
      )}
    </div>
  )
}
