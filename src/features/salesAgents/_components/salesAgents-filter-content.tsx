"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import { useState } from "react"

type FilterSalesAgentsContentProps = {
  dateFromIn?: Date
  dateToIn?: Date
  nameIn?: string
  statusIn?: string
  emailIn?: string
  onFilter: (filters: {
    dateFrom?: Date
    dateTo?: Date
    name: string
    status: string
    email: string
  }) => void
  onClose: () => void
}

export function SalesAgentsFilterContent({
  dateFromIn,
  dateToIn,
  nameIn,
  statusIn,
  emailIn,
  onFilter,
  onClose,
}: FilterSalesAgentsContentProps) {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(dateFromIn)
  const [dateTo, setDateTo] = useState<Date | undefined>(dateToIn)
  const [name, setName] = useState(nameIn || "")
  const [status, setStatus] = useState(statusIn || "")
  const [email, setEmail] = useState(emailIn || "")

  const statuses = [
    { value: "ACTIVE", label: "Ativo", color: "bg-emerald-500 hover:bg-emerald-600" },
    { value: "INACTIVE", label: "Inativo", color: "bg-red-500 hover:bg-red-600" },
  ]

  return (
    <div className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[1100px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Nome do Consultor</h3>
          <Input
            placeholder="Nome do consultor"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Email</h3>
          <Input
            placeholder="Email do consultor"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Status</h3>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <Badge
                key={s.value}
                variant="secondary"
                className={cn(
                  "cursor-pointer w-20 h-7 select-none text-sm",
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

        
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t">
        <Button 
          onClick={() => {
            onFilter({ dateFrom, dateTo, name, status, email })
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
