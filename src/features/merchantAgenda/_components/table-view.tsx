"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar } from "@/features/merchantAgenda/_components/calendar";
import MerchantAgendaReceiptsTotal from "@/features/merchantAgenda/_components/merchantAgenda-receipts-total";
import { formatDate } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DailyAmount } from "../server/merchantAgenda";

interface TableViewProps {
  monthlyData: DailyAmount[];
  isLoading: boolean;
  total: number;
  handleMonthChange: (newDate: Date) => void;
  setView: (view: "month" | "day") => void;
  status: string;
}

export function TableView({
  monthlyData,
  isLoading,
  handleMonthChange,
  total,
  setView,
  status,
}: TableViewProps) {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [monthView, setMonthView] = useState<"calendar" | "table">("calendar");

  // Function to handle date click
  const handleDateClick = (date: string) => {
    const params = new URLSearchParams();
    params.set("date", date);
    router.push(`?${params.toString()}`);
    setView("day");
  };

  // Function to navigate to previous month
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
    handleMonthChange(prevMonth);
  };

  // Function to navigate to next month
  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
    handleMonthChange(nextMonth);
  };

  // Format the current month and year
  const formattedMonthYear = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(currentMonth);

  // Sort data by date
  const sortedData = [...monthlyData].sort((a, b) => {
    return Number.parseInt(a.date) - Number.parseInt(b.date);
  });
  console.log(status);
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Mês Anterior
          </Button>

          <h3 className="text-lg font-medium capitalize">
            {formattedMonthYear.toUpperCase()}
          </h3>

          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            Próximo Mês
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="mb-4">
          <MerchantAgendaReceiptsTotal
            merchantAgendaReceiptsTotalProps={{
              total: total,
              view: "month",
              status: status,
            }}
          />
        </div>

        <div className="mb-4 flex justify-start">
          <ToggleGroup
            type="single"
            value={monthView}
            onValueChange={(v) => v && setMonthView(v as "calendar" | "table")}
          >
            <ToggleGroupItem value="calendar">Calendário</ToggleGroupItem>
            <ToggleGroupItem value="table">Tabela</ToggleGroupItem>
          </ToggleGroup>
        </div>
        {monthView === "table" ? (
          <div className="border overflow-x-auto rounded-lg px-2">
            <Table className="">
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold w-[60%] min-w-[180px] text-black">
                    Data
                  </TableHead>
                  <TableHead className="font-semibold w-[40%] min-w-[140px] text-right text-black">
                    Valor Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4">
                      Carregando dados...
                    </TableCell>
                  </TableRow>
                ) : sortedData.length > 0 ? (
                  sortedData.map((item) => (
                    <tr key={item.date} className="w-full ">
                      <td colSpan={2} className="p-0 border-0">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value={item.date} className="border-0">
                            <AccordionTrigger className="hover:no-underline w-full py-2 border-b border-gray-200 ">
                              <div className="flex items-center justify-between w-full ">
                                <div
                                  className="text-muted-foreground hover:underline cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDateClick(item.date);
                                  }}
                                >
                                  {formatDate(new Date(item.date))}
                                </div>
                                <div className="text-right text-muted-foreground">
                                  {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  }).format(item.amount)}
                                </div>
                              </div>
                            </AccordionTrigger>
                          </AccordionItem>
                        </Accordion>
                      </td>
                    </tr>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4">
                      Nenhum dado disponível para este mês
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Calendar
            monthlyData={monthlyData}
            handleMonthChange={handleMonthChange}
            isLoading={isLoading}
            onPrevMonth={goToPreviousMonth}
            onNextMonth={goToNextMonth}
            currentMonth={currentMonth}
            onDateClick={handleDateClick}
          />
        )}
      </CardContent>
    </Card>
  );
}
