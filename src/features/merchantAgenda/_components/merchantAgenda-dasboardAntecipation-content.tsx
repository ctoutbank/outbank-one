"use client"

import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Building2, Calendar, CircleDollarSign, ClipboardList, Tag } from "lucide-react"

type MerchantAgendaAnticipationsDashboardContentProps = {
  totalEstablishments: number
  totalAnticipationRequests: number
  totalParcels: number
  fullyAnticipatedParcels: number
  partiallyAnticipatedParcels: number
  totalNetAnticipated: number
  totalGrossAnticipated: number
  totalAnticipationFees: number
  firstTransactionDate?: string
  lastTransactionDate?: string
}

export function MerchantAgendaAnticipationsDashboardContent({
                                                              totalEstablishments,
                                                              totalAnticipationRequests,
                                                              totalParcels,
                                                              fullyAnticipatedParcels,
                                                              partiallyAnticipatedParcels,
                                                              totalNetAnticipated,
                                                              totalGrossAnticipated,
                                                              totalAnticipationFees,
                                                              firstTransactionDate,
                                                              lastTransactionDate,
                                                            }: MerchantAgendaAnticipationsDashboardContentProps) {
  // Formatação das datas de transação para exibição
  const formattedFirstDate = firstTransactionDate ? new Date(firstTransactionDate).toLocaleDateString("pt-BR") : "-"
  const formattedLastDate = lastTransactionDate ? new Date(lastTransactionDate).toLocaleDateString("pt-BR") : "-"

  const periodText = `${formattedFirstDate} - ${formattedLastDate}`

  return (
      <div className="space-y-4">
        <div className="w-full mt-2 mb-2">
          <div className="grid grid-cols-1 gap-4">
            <Card className="w-full border-l-8 border-black bg-sidebar min-h-[200px]">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row justify-between gap-12">
                  {/* Período */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xl font-bold">Período</span>
                    </div>
                    <div className="text-lg font-semibold text-zinc-900 mb-3">{periodText}</div>
                  </div>

                  {/* Estabelecimentos */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xl font-bold">Estabelecimentos</span>
                    </div>
                    <div className="text-2xl font-semibold text-zinc-900 mb-3">{totalEstablishments}</div>
                  </div>

                  {/* Pedidos de Antecipação */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <ClipboardList className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xl font-bold whitespace-nowrap">Pedidos de Antecipação</span>
                    </div>
                    <div className="text-2xl font-semibold text-zinc-900 mb-3">{totalAnticipationRequests}</div>
                  </div>

                  {/* Parcelas */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xl font-bold">Parcelas</span>
                    </div>
                    <div className="text-2xl font-semibold text-zinc-900 mb-3">{totalParcels}</div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-medium text-zinc-600">Totalmente</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">
                        {fullyAnticipatedParcels}
                      </span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-amber-500" />
                          <span className="text-xs font-medium text-zinc-600">Parcialmente</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">
                        {partiallyAnticipatedParcels}
                      </span>
                      </div>
                    </div>
                  </div>

                  {/* Valores Financeiros */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CircleDollarSign className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xl font-bold whitespace-nowrap">Total Líquido Antecipado</span>
                    </div>
                    <div className="text-2xl font-semibold text-zinc-900 mb-3">{formatCurrency(totalNetAnticipated)}</div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-medium text-zinc-600">Bruto</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">
                        {formatCurrency(totalGrossAnticipated)}
                      </span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-xs font-medium text-zinc-600">Taxas</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">
                        {formatCurrency(totalAnticipationFees)}
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
