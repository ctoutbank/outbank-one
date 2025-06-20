"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Search } from 'lucide-react'
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { format as formatDate } from "date-fns"

type FilterEdisContentProps = {
  typeIn?: string
  statusIn?: string
  dateIn?: string
  onFilter: (filters: { type: string; status: string; date: string }) => void
  onClose: () => void
}

export function FilterEdisContent({
                                    typeIn,
                                    statusIn,
                                    dateIn,
                                    onFilter,
                                    onClose,
                                  }: FilterEdisContentProps) {
  const [type, setType] = useState(typeIn || "")
  const [status, setStatus] = useState(statusIn || "")
  const [date, setDate] = useState(dateIn || "")

  const statuses = [
    {
      value: "PROCESSED",
      label: "Processado",
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
    {
      value: "PENDING",
      label: "Pendente",
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    { value: "ERROR", label: "Erro", color: "bg-red-500 hover:bg-red-600" },
  ]

  const types = [
    {
      value: "REMESSA",
      label: "Remessa",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      value: "RETORNO",
      label: "Retorno",
      color: "bg-purple-500 hover:bg-purple-600",
    },
  ]

  return (
      <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-0 duration-200"
          onClick={onClose}
      >
        <div
            className="bg-background border rounded-lg p-6 shadow-xl min-w-[900px] max-w-[90vw] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium ml-2">Tipo de Arquivo</h3>
              <div className="flex flex-wrap gap-2">
                {types.map((t) => (
                    <Badge
                        key={t.value}
                        variant="secondary"
                        className={cn(
                            "cursor-pointer w-24 h-7 select-none text-sm",
                            type === t.value ? t.color : "bg-secondary",
                            type === t.value ? "text-white" : "text-secondary-foreground",
                        )}
                        onClick={() => setType(type === t.value ? "" : t.value)}
                    >
                      {t.label}
                    </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2 ml-8">
              <h3 className="text-sm font-medium ml-2">Status</h3>
              <div className="flex flex-wrap gap-2">
                {statuses.map((s) => (
                    <Badge
                        key={s.value}
                        variant="secondary"
                        className={cn(
                            "cursor-pointer w-24 h-7 select-none text-sm",
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
              <h3 className="text-sm font-medium">Data</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? formatDate(new Date(date), "dd/MM/yyyy") : "dd/mm/aaaa"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[60]" onMouseDown={(e) => e.stopPropagation()}>
                  <Calendar
                      mode="single"
                      selected={date ? new Date(date) : undefined}
                      onSelect={(selectedDate) => {
                        if (selectedDate) {
                          setDate(selectedDate.toISOString().split("T")[0]) // formata como yyyy-MM-dd
                        }
                      }}
                      initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end pt-4 mt-4 border-t">
            <Button
                onClick={() => {
                  onFilter({ type, status, date })
                  onClose()
                }}
                className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Filtrar
            </Button>
          </div>
        </div>
      </div>
  )
}