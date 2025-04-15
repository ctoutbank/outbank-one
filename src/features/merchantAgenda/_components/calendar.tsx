"use client";

import { Card } from "@/components/ui/card";
import type {
  BrandData,
  DailyAmount,
  GlobalSettlementResult,
  PaymentMethodData,
} from "@/features/merchantAgenda/server/merchantAgenda";
import { DatesSetArg } from "@fullcalendar/core";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { useEffect, useRef, useState } from "react";

// Importar a Server Action do arquivo dedicado
import { fetchDailyStats } from "@/features/merchantAgenda/server/actions/calendarActions";

interface CalendarProps {
  monthlyData: DailyAmount[];
  handleMonthChange: (newDate: Date) => void;
  dailyData?: GlobalSettlementResult;
  isLoading?: boolean;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  currentMonth?: Date;
  onDateClick?: (date: string) => void;
}

interface DailyStats {
  [date: string]: {
    paymentMethods: PaymentMethodData[];
    brands: BrandData[];
  };
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

export function Calendar({
  monthlyData,
  handleMonthChange,
  isLoading = false,
  currentMonth,
  onDateClick,
}: CalendarProps) {
  const [dailyStats, setDailyStats] = useState<DailyStats>({});
  const [statsLoading, setStatsLoading] = useState<boolean>(false);
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    if (calendarRef.current && currentMonth) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(currentMonth);
    }
  }, [currentMonth]);

  useEffect(() => {
    async function loadDailyStatistics() {
      if (monthlyData.length === 0) return;

      setStatsLoading(true);
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
      } finally {
        setStatsLoading(false);
      }
    }

    loadDailyStatistics();
  }, [monthlyData]);

  const events = monthlyData.map(({ date, amount }) => ({
    title: new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount),
    date,
    extendedProps: {
      amount,
    },
  }));

  const handleDatesSet = (arg: DatesSetArg) => {
    // Só atualiza se não for uma mudança programática
    if (
      !currentMonth ||
      currentMonth.getMonth() !== arg.view.currentStart.getMonth() ||
      currentMonth.getFullYear() !== arg.view.currentStart.getFullYear()
    ) {
      handleMonthChange(arg.view.currentStart);
    }
  };

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
    <Card className="p-4 overflow-hidden">
      {isLoading && (
        <div className="text-center mb-4 p-2 bg-muted rounded">
          <div className="text-sm text-muted-foreground">
            Carregando dados do mês...
          </div>
        </div>
      )}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        datesSet={handleDatesSet}
        locale={ptBrLocale}
        events={events}
        showNonCurrentDates={false}
        headerToolbar={false}
        dayHeaderFormat={{ weekday: "short" }}
        eventContent={(eventInfo) => {
          const date = new Date(eventInfo.event.startStr);

          const hasData = eventInfo.event.extendedProps.amount > 0;
          const formattedDate = date.toISOString().split("T")[0];

          // Obtém estatísticas para o dia atual
          const dayStats = dailyStats[formattedDate] || {
            paymentMethods: [],
            brands: [],
          };

          return (
            <div
              className="p-2 h-full flex flex-col cursor-pointer"
              onClick={() => hasData && onDateClick?.(formattedDate)}
            >
              <div className="text-xs text-muted-foreground capitalize mb-1">
                {}
              </div>
              {hasData && (
                <>
                  <div className="text-xs font-medium text-muted-foreground">
                    Recebíveis
                  </div>
                  <div className="text-sm font-medium text-primary mb-1">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(eventInfo.event.extendedProps.amount)}
                  </div>

                  <div className="grid grid-cols-2 gap-x-1 text-[0.6rem] mt-1">
                    {/* Coluna 1: Todos os métodos de pagamento */}
                    <div className="flex flex-col space-y-0.5">
                      {FIXED_PAYMENT_METHODS.map((method) => (
                        <div key={method.id} className="flex items-center">
                          <div
                            className={`font-medium ${getPaymentMethodColor(
                              method.id
                            )} w-7 text-right`}
                          >
                            {formatPercentage(
                              getPaymentMethodPercentage(method.id, dayStats)
                            )}
                          </div>
                          <div className="ml-1 w-[4.5rem] truncate text-muted-foreground">
                            {method.name}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Coluna 2: Todas as bandeiras */}
                    <div className="flex flex-col space-y-0.5">
                      {FIXED_BRANDS.map((brand) => (
                        <div key={brand.id} className="flex items-center">
                          <div
                            className={`font-medium ${getBrandColor(
                              brand.id
                            )} w-7 text-right`}
                          >
                            {formatPercentage(
                              getBrandPercentage(brand.id, dayStats)
                            )}
                          </div>
                          <div className="ml-1 w-[4.5rem] truncate text-muted-foreground">
                            {brand.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {statsLoading && (
                    <div className="text-xs text-muted-foreground mt-1 text-center">
                      Carregando...
                    </div>
                  )}
                </>
              )}
            </div>
          );
        }}
        height="auto"
        dayCellClassNames="rounded-lg hover:bg-accent transition-colors"
        eventClassNames="!bg-transparent !border-none !text-foreground h-full"
        dayHeaderClassNames="text-muted-foreground text-sm"
      />
    </Card>
  );
}
