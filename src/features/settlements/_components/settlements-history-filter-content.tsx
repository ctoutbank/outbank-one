"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { validateDateRange } from "@/lib/validations/date"
import { format } from "date-fns"
import { CalendarIcon, Search } from 'lucide-react'
import { type KeyboardEvent, useState } from "react"

type SettlementsHistoryFilterContentProps = {
  statusIn?: string
  dateFromIn?: Date
  dateToIn?: Date
  onFilter: (filters: {
    status: string
    dateFrom?: Date
    dateTo?: Date
  }) => void
  onClose: () => void
}

export function SettlementsHistoryFilterContent({
                                                  statusIn,
                                                  dateFromIn,
                                                  dateToIn,
                                                  onFilter,
                                                  onClose,
                                                }: SettlementsHistoryFilterContentProps) {
  const [status, setStatus] = useState(statusIn || "")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(dateFromIn)
  const [dateTo, setDateTo] = useState<Date | undefined>(dateToIn)
  const [dateError, setDateError] = useState<string | null>(null)

  const statuses = [
    {
      value: "pending",
      label: "Pendente",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      value: "pre-approved",
      label: "Pré Aprovado",
      color: "bg-sky-500 hover:bg-sky-600",
    },
    {
      value: "approved",
      label: "Aprovado",
      color: "bg-blue-700 hover:bg-blue-800",
    },
    {
      value: "processing",
      label: "Processando",
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    { value: "error", label: "Erro", color: "bg-red-500 hover:bg-red-600" },
    {
      value: "settled",
      label: "Liquidado",
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
  ]

  const applyFilters = () => {
    const validation = validateDateRange(dateFrom, dateTo)
    if (!validation.isValid) {
      setDateError(validation.error)
      return
    }
    setDateError(null)
    onFilter({ status, dateFrom, dateTo })
    onClose()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      applyFilters()
    }
  }

  return (
      <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-0 duration-200"
          onClick={onClose}
      >
        <div
            className="bg-background border rounded-lg p-6 shadow-xl min-w-[600px] max-w-[90vw] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onKeyDown={handleKeyDown}
            tabIndex={0}
            onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filtros</h2>
            <button
                onClick={onClose}
                className="h-8 w-8 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Status</h3>
              <div className="flex flex-wrap gap-2">
                {statuses.map((s) => (
                    <Badge
                        key={s.value}
                        variant="secondary"
                        className={cn(
                            "cursor-pointer w-28 h-8 select-none",
                            status === s.value ? s.color : "bg-secondary",
                            status === s.value ? "text-white" : "text-secondary-foreground",
                        )}
                        onClick={() => setStatus(status === s.value ? "" : s.value)}
                    >
                      {s.label}
                    </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Intervalo de Datas</h3>
              {dateError && <p className="text-sm text-red-500">{dateError}</p>}
              <div className="flex flex-wrap gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn("w-[240px] justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "dd/mm/aaaa"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[60]" align="start" onMouseDown={(e) => e.stopPropagation()}>
                    <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={(date) => {
                          setDateFrom(date)
                          setDateError(null)
                        }}
                        initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn("w-[240px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "dd/MM/yyyy") : "dd/mm/aaaa"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[60]" align="start" onMouseDown={(e) => e.stopPropagation()}>
                    <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={(date) => {
                          setDateTo(date)
                          setDateError(null)
                        }}
                        initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t">
              <Button onClick={applyFilters} className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Filtrar
              </Button>
            </div>
          </div>
        </div>
      </div>
  )
}