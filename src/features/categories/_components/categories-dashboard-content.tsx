"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tags } from "lucide-react"

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
                                           }: CategoriesDashboardContentProps) {
  return (
      <div className="space-y-4">
        <div className="w-full mt-2 mb-2">
          <div className="grid grid-cols-1 gap-4">
            <Card className="w-full border-l-8 border-black bg-sidebar min-h-[200px]">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row justify-between gap-12">
                  {/* Total de Categorias */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Tags className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xl font-bold">Total de Categorias</span>
                    </div>
                    <div className="text-2xl font-semibold text-zinc-900 mb-3">{totalCategories}</div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-medium text-zinc-600">Ativas</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">
                        {activeCategories}
                      </span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-xs font-medium text-zinc-600">Inativas</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">
                        {inactiveCategories}
                      </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
