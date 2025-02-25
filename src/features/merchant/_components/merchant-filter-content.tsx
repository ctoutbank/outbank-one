"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Search } from "lucide-react"
import { useState } from "react"

type FilterMerchantsContentProps = {
  dateFromIn?: Date
  dateToIn?: Date
  establishmentIn?: string
  statusIn?: string
  stateIn?: string
  onFilter: (filters: {
    dateFrom?: Date
    dateTo?: Date
    establishment: string
    status: string
    state: string
  }) => void
  onClose: () => void
}

export function FilterMerchantsContent({
  dateFromIn,
  dateToIn,
  establishmentIn,
  statusIn,
  stateIn,
  onFilter,
  onClose,
}: FilterMerchantsContentProps) {
  const [establishment, setEstablishment] = useState(establishmentIn || "")
  const [status, setStatus] = useState(statusIn || "")
  const [state, setState] = useState(stateIn || "")

  const statuses = [
    { value: "APPROVED", label: "Aprovado", color: "bg-emerald-500 hover:bg-emerald-600" },
    { value: "PENDING", label: "Pendente", color: "bg-yellow-500 hover:bg-yellow-600" },
    { value: "REJECTED", label: "Rejeitado", color: "bg-red-500 hover:bg-red-600" },
  ]

  return (
    <div className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[1100px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Your existing filter inputs */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Estabelecimento</h3>
          <Input
            placeholder="Nome do estabelecimento"
            value={establishment}
            onChange={(e) => setEstablishment(e.target.value)}
          />
        </div>

        <div className="space-y-2 ml-8">
          <h3 className="text-sm font-medium ml-2">Status KYC</h3>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <Badge
                key={s.value}
                variant="secondary"
                className={cn(
                  "cursor-pointer w-24 h-7 select-none text-sm",
                  status === s.value ? s.color : "bg-secondary",
                  status === s.value ? "text-white" : "text-secondary-foreground"
                )}
                onClick={() => setStatus(status === s.value ? "" : s.value)}
              >
                {s.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Estado (UF)</h3>
          <Input
            placeholder="UF"
            value={state}
            onChange={(e) => setState(e.target.value)}
            maxLength={2}
            className="uppercase"
          />
        </div>

        {/* Rest of your filter inputs */}
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t">
        <Button 
          onClick={() => {
            onFilter({ establishment, status, state })
            onClose()
          }} 
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Filtrar
        </Button>
      </div>
    </div>
  )
}