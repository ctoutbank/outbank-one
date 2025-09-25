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

  const events = monthlyData.map(
    ({ date, amount, status, is_anticipation }) => ({
      title: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount),
      date,
      extendedProps: {
        amount,
        status,
        is_anticipation,
      },
    })
  );
  console.log(events);
  return (
    <Card className="p-4 overflow-hidden">
      {isLoading && (
        <div className="flex flex-col items-center mb-4 p-2 bg-muted rounded">
          <svg
            className="animate-spin h-6 w-6 text-zinc-500 mb-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
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
                  {eventInfo.event.extendedProps.is_anticipation ? (
                    <div className="text-xs font-medium text-muted-foreground flex items-center ">
                      Recebíveis
                      <img
                        src="/eventual-anticipation.png"
                        alt="icon"
                        width={18}
                        height={18}
                      />
                    </div>
                  ) : (
                    <div className="text-xs font-medium text-muted-foreground">
                      Recebíveis
                    </div>
                  )}
                  <div
                    className={`text-sm font-medium mb-1 ${
                      eventInfo.event.extendedProps.status.includes(
                        "SETTLED",
                        "FULLY_ANTICIPATED"
                      )
                        ? "text-[#177a3c]"
                        : eventInfo.event.extendedProps.status == "PROVISIONED"
                          ? "text-[#bf8419]"
                          : "text-[#177a3c]"
                    }`}
                  >
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
