"use client";

import { Card } from "@/components/ui/card";
import type { DailyAmount } from "@/features/merchantAgenda/server/merchantAgenda";
import { DatesSetArg } from "@fullcalendar/core";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";

interface CalendarProps {
  monthlyData: DailyAmount[];
  handleMonthChange: (newDate: Date) => void;
}

export function Calendar({ monthlyData, handleMonthChange }: CalendarProps) {
  const events = monthlyData.map(({ date, amount }) => ({
    date,
    amount,
  }));
  const handleDatesSet = (arg: DatesSetArg) => {
    const year = arg.view.currentStart.getFullYear();
    const month = (arg.view.currentStart.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const day = arg.view.currentStart.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    handleMonthChange(new Date(formattedDate));
  };
  return (
    <Card className="p-4 overflow-hidden">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        datesSet={handleDatesSet}
        locale={ptBrLocale}
        events={events}
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next",
        }}
        dayHeaderFormat={{ weekday: "short" }}
        eventContent={(eventInfo) => {
          const date = new Date(eventInfo.event.startStr);
          const weekday = new Intl.DateTimeFormat("pt-BR", {
            weekday: "short",
          }).format(date);

          return (
            <div className="p-2 h-full">
              <div className="text-xs text-muted-foreground capitalize mb-2">
                {weekday}
              </div>
              {eventInfo.event.extendedProps.amount > 0 && (
                <>
                  <div className="text-xs font-medium text-muted-foreground">
                    Recebíveis
                  </div>
                  <div className="text-sm font-medium text-primary">
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
        eventClassNames="!bg-transparent !border-none !text-foreground"
        dayHeaderClassNames="text-muted-foreground text-sm"
      />
    </Card>
  );
}
