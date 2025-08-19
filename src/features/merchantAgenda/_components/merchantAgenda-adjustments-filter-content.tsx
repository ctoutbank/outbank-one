"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Search } from "lucide-react"
import { useState } from "react"
import type * as React from "react"

type AdjustmentsListFilterContentProps = {
  dateFromIn?: Date
  dateToIn?: Date
  establishmentIn?: string
  onFilter: (filters: {
    dateFrom?: Date
    dateTo?: Date
    establishment?: string
  }) => void
  onClose: () => void
}

export function AdjustmentsListFilterContent({
                                               dateFromIn,
                                               dateToIn,
                                               establishmentIn,
                                               onFilter,
                                               onClose,
                                             }: AdjustmentsListFilterContentProps) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(dateFromIn)
  const [dateTo, setDateTo] = useState<Date | undefined>(dateToIn)
  const [establishment, setEstablishment] = useState(establishmentIn || "")

  const handlePopoverContentClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Impede que o evento de clique se propague para o trigger
  }

  // Mock data for establishments
  const establishments = [
    { id: "1", name: "Estabelecimento A" },
    { id: "2", name: "Estabelecimento B" },
    { id: "3", name: "Estabelecimento C" },
    { id: "4", name: "Estabelecimento D" },
    { id: "5", name: "Estabelecimento E" },
  ]

  return (
      <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in-0 duration-200"
          onClick={onClose}
      >
        <div
            className="bg-background border rounded-lg p-6 shadow-xl min-w-[700px] max-w-[90vw] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Data de Lançamento</h3>
                <div className="flex flex-col gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "dd/mm/yyyy"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[60]" align="start" onMouseDown={(e) => e.stopPropagation()}>
                      <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !dateTo && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "dd/MM/yyy") : "dd/mm/yyyy"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto p-0 z-[60]"
                        align="start"
                        onClick={handlePopoverContentClick}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                      <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Estabelecimento</h3>
                <Select value={establishment} onValueChange={setEstablishment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um estabelecimento" />
                  </SelectTrigger>
                  <SelectContent onMouseDown={(e) => e.stopPropagation()}>
                    <SelectItem value="all">Todos</SelectItem>
                    {establishments.map((est) => (
                        <SelectItem key={est.id} value={est.id}>
                          {est.name}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 mt-4 border-t">
            <Button
                onClick={() => {
                  onFilter({
                    dateFrom,
                    dateTo,
                    establishment,
                  })
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
