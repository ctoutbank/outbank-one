"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, LayoutGrid } from "lucide-react"
import { useState } from "react"
import { formatCurrency } from "@/lib/utils"

export type SettlementsHistoryOverviewProps = {
  totalSettlements: number
  date: Date
  totalGrossAmount: number
  totalNetAmount: number
  totalRestitutionAmount: number
  pendingSettlements: number
  approvedSettlements: number
  processedSettlements: number
}

export default function SettlementsHistoryOverview({
  totalSettlements,
  totalGrossAmount,
  totalNetAmount,
  totalRestitutionAmount,
  pendingSettlements,
  approvedSettlements,
  processedSettlements,
}: SettlementsHistoryOverviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group relative flex items-center gap-2 bg-gradient-to-r from-zinc-900 to-zinc-800 px-3 py-1.5 rounded-lg shadow-lg hover:from-zinc-800 hover:to-zinc-700 transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          <div className="p-1 bg-zinc-800/50 rounded-md group-hover:bg-zinc-700/50">
            <LayoutGrid className="h-3.5 w-3.5 text-zinc-100" />
          </div>
          <span className="text-sm font-medium text-zinc-100">Dashboard</span>
          
        </div>
        <ChevronRight
          className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
        />
      </button>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Total Settlements Card */}
          <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-0 shadow-md">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs mr-2 font-medium text-zinc-300">Total de Liquidações</span>
                <span className="text-lg font-semibold text-zinc-100">{totalSettlements}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Valor Total Bruto</span>
                  <span className="text-xs font-medium text-zinc-300">{formatCurrency(totalGrossAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Valor Total Líquido</span>
                  <span className="text-xs font-medium text-zinc-300">{formatCurrency(totalNetAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card className="bg-gradient-to-br from-zinc-800 to-zinc-700 border-0 shadow-md">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-zinc-300">Status das Liquidações</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Pendentes</span>
                  <span className="text-xs font-medium text-zinc-300">{pendingSettlements}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Aprovadas</span>
                  <span className="text-xs font-medium text-zinc-300">{approvedSettlements}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Processadas</span>
                  <span className="text-xs font-medium text-zinc-300">{processedSettlements}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Restitution Card */}
          <Card className="bg-gradient-to-br from-zinc-700 to-zinc-600 border-0 shadow-md">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-zinc-300">Restituições</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Valor Total</span>
                  <span className="text-xs font-medium text-zinc-300">{formatCurrency(totalRestitutionAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}