"use client"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import ptBrLocale from "@fullcalendar/core/locales/pt-br"
import { Card } from "@/components/ui/card"

interface CalendarEvent {
  title: string
  date: string
  extendedProps: {
    amount: number
  }
}

export function Calendar({ events }: { events: CalendarEvent[] }) {
  return (
    <Card className="p-4">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale={ptBrLocale}
        events={events}
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next",
        }}
        eventContent={(eventInfo) => (
          <div className="p-1">
            <div className="font-medium">Recebíveis</div>
            <div className="text-sm text-primary">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(eventInfo.event.extendedProps.amount)}
            </div>
          </div>
        )}
        height="auto"
      />
    </Card>
  )
}

