"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tags, Clock, Percent } from "lucide-react"

type CategoriesDashboardContentProps = {
  totalCategories: number
  activeCategories: number
  inactiveCategories: number
  avgWaitingPeriodCp: number
  avgWaitingPeriodCnp: number
  avgAnticipationRiskFactorCp: number
  avgAnticipationRiskFactorCnp: number
}

export function CategoriesDashboardContent({
  totalCategories,
  activeCategories,
  inactiveCategories,
  avgWaitingPeriodCp,
  avgWaitingPeriodCnp,
  avgAnticipationRiskFactorCp,
  avgAnticipationRiskFactorCnp,
}: CategoriesDashboardContentProps) {
  return (
    <div className="w-full mt-4 mb-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Categories Card */}
        <Card className="bg-white min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Tags className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">Total de Categorias</span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900">{totalCategories}</span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">Ativas</span>
                </div>
                <span className="text-base font-semibold text-zinc-900">{activeCategories}</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span className="text-xs font-medium text-zinc-600">Inativas</span>
                </div>
                <span className="text-base font-semibold text-zinc-900">{inactiveCategories}</span>
              </div> 
            </div>
          </CardContent>
        </Card>

        {/* Waiting Period Card */}
        <Card className="bg-white min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">Período de Espera</span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900 invisible">0</span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span className="text-xs font-medium text-zinc-600">CP Médio</span>
                </div>
                <span className="text-base font-semibold text-zinc-900">{avgWaitingPeriodCp} dias</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span className="text-xs font-medium text-zinc-600">CNP Médio</span>
                </div>
                <span className="text-base font-semibold text-zinc-900">{avgWaitingPeriodCnp} dias</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Factor Card */}
        <Card className="bg-white min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">Fator de Risco</span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900 invisible">0</span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span className="text-xs font-medium text-zinc-600">CP Médio</span>
                </div>
                <span className="text-base font-semibold text-zinc-900">{avgAnticipationRiskFactorCp}%</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span className="text-xs font-medium text-zinc-600">CNP Médio</span>
                </div>
                <span className="text-base font-semibold text-zinc-900">{avgAnticipationRiskFactorCnp}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}