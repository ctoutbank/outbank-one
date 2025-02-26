"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import { useState } from "react"

type LegalNatureFilterContentProps = {
  nameIn?: string
  codeIn?: string
  activeIn?: string
  onFilter: (filters: {
    name: string
    code: string
    active: string
  }) => void
  onClose: () => void
}

export function LegalNatureFilterContent({
  nameIn,
  codeIn,
  activeIn,
  onFilter,
  onClose,
}: LegalNatureFilterContentProps) {
  const [name, setName] = useState(nameIn || "")
  const [code, setCode] = useState(codeIn || "")
  const [active, setActive] = useState(activeIn || "")

  const statuses = [
    { value: "true", label: "Ativo", color: "bg-emerald-500 hover:bg-emerald-600" },
    { value: "false", label: "Inativo", color: "bg-red-500 hover:bg-red-600" },
  ]

  return (
    <div className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[600px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Nome</h3>
          <Input
            placeholder="Nome da natureza jurídica"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Código</h3>
          <Input
            placeholder="Código"
            value={code}
            onChange={(e) => setCode(e.target.value)}
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
                  "cursor-pointer w-24 h-7 select-none text-sm",
                  active === s.value ? s.color : "bg-secondary",
                  active === s.value ? "text-white" : "text-secondary-foreground"
                )}
                onClick={() => setActive(active === s.value ? "" : s.value)}
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
            onFilter({ name, code, active })
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