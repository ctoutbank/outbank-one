"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
      <div className="w-full">
        <div className="w-full mt-2 mb-2">
          <Card className="w-full border-l-8 border-black bg-sidebar">
            <div className="flex items-center justify-between">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Visão geral</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </CardHeader>
            </div>

            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6 w-full">
                {/* Total de Categorias */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-4">
                    <Tags className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg font-medium">Total de Categorias</span>
                  </div>

                  <div className="grid gap-4">
                    <div className="text-center p-4 bg-background rounded-lg border">
                      <div className="text-2xl font-semibold text-zinc-900 mb-2">{totalCategories}</div>
                      <div className="text-sm text-muted-foreground">Total de Categorias</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-emerald-500" />
                          <span className="text-sm font-medium text-zinc-600">Ativas</span>
                        </div>
                        <div className="text-lg font-semibold text-zinc-900">{activeCategories}</div>
                      </div>

                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-red-500" />
                          <span className="text-sm font-medium text-zinc-600">Inativas</span>
                        </div>
                        <div className="text-lg font-semibold text-zinc-900">{inactiveCategories}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Espaço para futuras expansões */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-4">
                    <Tags className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg font-medium">Estatísticas Adicionais</span>
                  </div>

                  <div className="grid gap-4">
                    <div className="text-center p-4 bg-background rounded-lg border">
                      <div className="text-2xl font-semibold text-zinc-900 mb-2">
                        {((activeCategories / totalCategories) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Taxa de Ativação</div>
                    </div>

                    <div className="p-3 bg-background rounded-lg border">
                      <div className="text-sm font-medium mb-2">Distribuição</div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Categorias Ativas</span>
                          <span className="text-sm font-semibold">{activeCategories}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                              className="bg-emerald-500 h-2 rounded-full"
                              style={{ width: `${(activeCategories / totalCategories) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Categorias Inativas</span>
                          <span className="text-sm font-semibold">{inactiveCategories}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${(inactiveCategories / totalCategories) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resumo Visual */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-4">
                    <Tags className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg font-medium">Resumo Visual</span>
                  </div>

                  <div className="grid gap-4">
                    <div className="p-4 bg-background rounded-lg border">
                      <div className="text-sm font-medium mb-3">Status das Categorias</div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-emerald-500"></div>
                            <span className="text-sm">Ativas</span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{activeCategories}</div>
                            <div className="text-xs text-gray-500">
                              {((activeCategories / totalCategories) * 100).toFixed(0)}%
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-red-500"></div>
                            <span className="text-sm">Inativas</span>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">{inactiveCategories}</div>
                            <div className="text-xs text-gray-500">
                              {((inactiveCategories / totalCategories) * 100).toFixed(0)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center p-3 bg-background rounded-lg border">
                      <div className="text-sm text-muted-foreground mb-1">Razão Ativo/Inativo</div>
                      <div className="text-lg font-semibold text-zinc-900">
                        {inactiveCategories > 0 ? (activeCategories / inactiveCategories).toFixed(2) : activeCategories}:1
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
