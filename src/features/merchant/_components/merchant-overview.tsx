"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, LayoutGrid } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export type MerchantOverviewProps = {
  totalMerchants: number
  date: Date
  activeMerchants: number
  inactiveMerchants: number
  pendingKyc: number
  approvedKyc: number
  rejectedKyc: number
  totalCpAnticipation: number
  totalCnpAnticipation: number
}

export default function MerchantOverview({
  totalMerchants,
  activeMerchants,
  inactiveMerchants,
  pendingKyc,
  approvedKyc,
  rejectedKyc,
  totalCpAnticipation,
  totalCnpAnticipation,
}: MerchantOverviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  

  return (
    <div>
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <LayoutGrid className="h-4 w-4" />
          Dashboard
          <ChevronRight
            className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
          />
        </Button>
      </div>

      {isExpanded && (
        <div className="mt-2 absolute left-0 bg-background border rounded-lg shadow-md min-w-[800px] z-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
            {/* Total Merchants Card */}
            <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-0 shadow-md">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs mr-2 font-medium text-zinc-300">Total de Estabelecimentos</span>
                  <span className="text-lg font-semibold text-zinc-100">{totalMerchants}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500">Ativos</span>
                    <span className="text-xs font-medium text-zinc-300">{activeMerchants}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500">Inativos</span>
                    <span className="text-xs font-medium text-zinc-300">{inactiveMerchants}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KYC Status Card */}
            <Card className="bg-gradient-to-br from-zinc-800 to-zinc-700 border-0 shadow-md">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-zinc-300">Status KYC</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500">Aprovados</span>
                    <span className="text-xs font-medium text-zinc-300">{approvedKyc}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500">Pendentes</span>
                    <span className="text-xs font-medium text-zinc-300">{pendingKyc}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500">Rejeitados</span>
                    <span className="text-xs font-medium text-zinc-300">{rejectedKyc}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Anticipation Card */}
            <Card className="bg-gradient-to-br from-zinc-700 to-zinc-600 border-0 shadow-md">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-zinc-300">Antecipações</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500">CP Ativos</span>
                    <span className="text-xs font-medium text-zinc-300">{totalCpAnticipation}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-500">CNP Ativos</span>
                    <span className="text-xs font-medium text-zinc-300">{totalCnpAnticipation}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}