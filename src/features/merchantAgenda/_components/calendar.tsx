"use client";

import { Card } from "@/components/ui/card";
import type { DailyAmount } from "@/features/merchantAgenda/server/merchantAgenda";
import { DatesSetArg } from "@fullcalendar/core";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { useEffect, useRef } from "react";

interface CalendarProps {
  monthlyData: DailyAmount[];
  handleMonthChange: (newDate: Date) => void;
  isLoading?: boolean;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  currentMonth?: Date;
  onDateClick?: (date: string) => void;
}

export function Calendar({
  monthlyData,
  handleMonthChange,
  isLoading = false,
  currentMonth,
  onDateClick,
}: CalendarProps) {
  const calendarRef = useRef<FullCalendar>(null);

  useEffect(() => {
    if (calendarRef.current && currentMonth) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(currentMonth);
    }
  }, [currentMonth]);

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
