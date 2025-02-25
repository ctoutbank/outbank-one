"use client"

import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react"
import { useState } from "react"

export type MerchantAgendaOverviewProps = {
  totalMerchant: number
  date: Date
  totalSales: number
  grossAmount: number
  taxAmount: number
  settledInstallments: number
  pendingInstallments: number
  settledGrossAmount: number
  settledTaxAmount: number
  anticipatedGrossAmount: number
  anticipatedTaxAmount: number
  toSettleInstallments: number
  toSettleGrossAmount: number
  toSettleTaxAmount: number
}

type ViewType = "settled" | "anticipated"

export default function MerchantAgendaOverview({
  totalMerchant,
  date,
  totalSales,
  grossAmount,
  taxAmount,
  settledInstallments,
  pendingInstallments,
  settledGrossAmount,
  settledTaxAmount,
  anticipatedGrossAmount,
  anticipatedTaxAmount,
  toSettleInstallments,
  toSettleGrossAmount,
  toSettleTaxAmount,
}: MerchantAgendaOverviewProps) {
  const [view, setView] = useState<ViewType>("settled")
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleView = () => {
    setView(view === "settled" ? "anticipated" : "settled")
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Estabelecimentos Card */}
          <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-0 shadow-md">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-zinc-300">Estabelecimentos</span>
                <span className="text-lg font-semibold text-zinc-100">{totalMerchant}</span>
              </div>
            </CardContent>
          </Card>

          {/* Vendas Card */}
          <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-0 shadow-md">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-zinc-300">Vendas</span>
                <span className="text-lg font-semibold text-zinc-100">{totalSales}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Valor Total Bruto</span>
                  <span className="text-xs font-medium text-zinc-300">{formatCurrency(grossAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Valor Total em Taxas</span>
                  <span className="text-xs font-medium text-zinc-300">{formatCurrency(taxAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parcelas Card */}
          <Card className="bg-gradient-to-br from-zinc-800 to-zinc-700 border-0 shadow-md">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={toggleView}
                    className="p-1 hover:bg-zinc-600/50 rounded-md transition-colors"
                    aria-label="Previous view"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 text-zinc-400" />
                  </button>
                  <span className="text-xs font-medium text-zinc-300">
                    {view === "settled" ? "Parcelas Liquidadas" : "Parcelas Antecipadas"}
                  </span>
                  <button
                    onClick={toggleView}
                    className="p-1 hover:bg-zinc-600/50 rounded-md transition-colors"
                    aria-label="Next view"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
                  </button>
                </div>
                <span className="text-lg font-semibold text-zinc-100">
                  {view === "settled" ? settledInstallments : pendingInstallments}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Valor Total Bruto</span>
                  <span className="text-xs font-medium text-zinc-300">
                    {formatCurrency(view === "settled" ? settledGrossAmount : anticipatedGrossAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Valor Total em Taxas</span>
                  <span className="text-xs font-medium text-zinc-300">
                    {formatCurrency(view === "settled" ? settledTaxAmount : anticipatedTaxAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parcelas a Liquidar Card */}
          <Card className="bg-gradient-to-br from-zinc-700 to-zinc-600 border-0 shadow-md">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-zinc-300">Parcelas a Liquidar</span>
                <span className="text-lg font-semibold text-zinc-100">{toSettleInstallments}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Valor Total Bruto</span>
                  <span className="text-xs font-medium text-zinc-300">{formatCurrency(toSettleGrossAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500">Valor Total em Taxas</span>
                  <span className="text-xs font-medium text-zinc-300">{formatCurrency(toSettleTaxAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

