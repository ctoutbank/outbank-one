"use client";

import {
  Accordion,
  AccordionContent,
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
import MerchantAgendaReceiptsTotal from "@/features/merchantAgenda/_components/merchantAgenda-receipts-total";
import { fetchDailyStats } from "@/features/merchantAgenda/server/actions/calendarActions";
import { formatDate } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type {
  BrandData,
  DailyAmount,
  PaymentMethodData,
} from "../server/merchantAgenda";

interface TableViewProps {
  monthlyData: DailyAmount[];
  isLoading: boolean;
  total: number;
  handleMonthChange: (newDate: Date) => void;
}

// Lista fixa de métodos de pagamento para exibir sempre
const FIXED_PAYMENT_METHODS = [
  { id: "DEBIT", name: "Débito" },
  { id: "CREDIT", name: "Crédito 1x" },
  { id: "CREDIT_2", name: "Crédito 2 a 6x" },
  { id: "CREDIT_3", name: "Crédito 7 a 12x" },
  { id: "PIX", name: "Pix" },
  { id: "PREPAYMENT", name: "Pré Pago" },
];

// Lista fixa de bandeiras para exibir sempre
const FIXED_BRANDS = [
  { id: "VISA", name: "Visa" },
  { id: "MASTERCARD", name: "Master" },
  { id: "ELO", name: "Elo" },
  { id: "HIPERCARD", name: "Hiper" },
  { id: "AMEX", name: "AMEX" },
  { id: "CABAL", name: "Cabal" },
];

// Paleta de cores para métodos de pagamento
const paymentMethodColors: Record<string, string> = {
  DEBIT: "text-emerald-600",
  CREDIT: "text-amber-600",
  CREDIT_2: "text-yellow-600",
  CREDIT_3: "text-orange-600",
  PIX: "text-cyan-600",
  PREPAYMENT: "text-indigo-600",
  CASH: "text-gray-600",
};

// Paleta de cores para bandeiras
const brandColors: Record<string, string> = {
  VISA: "text-blue-600",
  MASTERCARD: "text-red-600",
  ELO: "text-green-600",
  HIPERCARD: "text-purple-600",
  AMEX: "text-sky-600",
  CABAL: "text-gray-600",
};

interface DailyStats {
  [date: string]: {
    paymentMethods: PaymentMethodData[];
    brands: BrandData[];
  };
}

export function TableView({
  monthlyData,
  isLoading,
  handleMonthChange,
  total,
}: TableViewProps) {
  const [dailyStats, setDailyStats] = useState<DailyStats>({});
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

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

  useEffect(() => {
    async function loadDailyStatistics() {
      if (monthlyData.length === 0) return;

      try {
        // Para cada dia com dados, carregue as estatísticas
        const datesWithData = monthlyData
          .filter((day) => day.amount > 0)
          .map((day) => day.date);

        // Obter estatísticas via server action importada
        const stats = await fetchDailyStats(datesWithData);
        setDailyStats(stats);
      } catch (error) {
        console.error("Falha ao carregar estatísticas diárias:", error);
      }
    }

    loadDailyStatistics();
  }, [monthlyData]);

  // Função para obter cor baseada no tipo de método de pagamento
  const getPaymentMethodColor = (methodId: string): string => {
    return paymentMethodColors[methodId] || "text-gray-600";
  };

  // Função para obter cor baseada na bandeira
  const getBrandColor = (brandId: string): string => {
    return brandColors[brandId] || "text-gray-600";
  };

  // Função para obter a porcentagem de um método de pagamento
  const getPaymentMethodPercentage = (
    methodId: string,
    dayStats: any
  ): number => {
    if (!dayStats || !dayStats.paymentMethods) return 0;
    const method = dayStats.paymentMethods.find(
      (m: PaymentMethodData) => m.name === methodId
    );
    return method ? Math.round(method.percentage) : 0;
  };

  // Função para obter a porcentagem de uma bandeira
  const getBrandPercentage = (brandId: string, dayStats: any): number => {
    if (!dayStats || !dayStats.brands) return 0;
    const brand = dayStats.brands.find((b: BrandData) => b.name === brandId);
    return brand ? Math.round(brand.percentage) : 0;
  };

  // Função para formatar a porcentagem com largura fixa
  const formatPercentage = (value: number): string => {
    return `${value}%`;
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Mês Anterior
          </Button>

          <h3 className="text-lg font-medium capitalize">
            {formattedMonthYear}
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
            }}
          />
        </div>
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
                              <div className="text-muted-foreground">
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

                          <AccordionContent className="border-t bg-muted/20 border-b-2 border-gray-200">
                            <div className="p-4">
                              <div className="rounded-lg bg-white shadow-sm border border-gray-300">
                                <div className="px-4 py-3">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Métodos de Pagamento */}
                                    <div>
                                      <h4 className="text-sm font-medium mb-2">
                                        Métodos de Pagamento
                                      </h4>
                                      <div className="space-y-1">
                                        {FIXED_PAYMENT_METHODS.map((method) => (
                                          <div
                                            key={method.id}
                                            className="flex items-center text-sm"
                                          >
                                            <div
                                              className={`font-medium ${getPaymentMethodColor(
                                                method.id
                                              )} w-12 text-right`}
                                            >
                                              {formatPercentage(
                                                getPaymentMethodPercentage(
                                                  method.id,
                                                  dailyStats[item.date]
                                                )
                                              )}
                                            </div>
                                            <div className="ml-2 text-muted-foreground">
                                              {method.name}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Bandeiras */}
                                    <div>
                                      <h4 className="text-sm font-medium mb-2">
                                        Bandeiras
                                      </h4>
                                      <div className="space-y-1">
                                        {FIXED_BRANDS.map((brand) => (
                                          <div
                                            key={brand.id}
                                            className="flex items-center text-sm"
                                          >
                                            <div
                                              className={`font-medium ${getBrandColor(
                                                brand.id
                                              )} w-12 text-right`}
                                            >
                                              {formatPercentage(
                                                getBrandPercentage(
                                                  brand.id,
                                                  dailyStats[item.date]
                                                )
                                              )}
                                            </div>
                                            <div className="ml-2 text-muted-foreground">
                                              {brand.name}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
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
      </CardContent>
    </Card>
  );
}
