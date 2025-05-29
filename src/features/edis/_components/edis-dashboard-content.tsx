"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, FileCheck, FileText } from "lucide-react"

type EdisDashboardContentProps = {
  totalEdis: number
  activeEdis: number
  inactiveEdis: number
  pendingEdis: number
  processedEdis: number
  errorEdis: number
}

export function EdisDashboardContent({
                                       totalEdis,
                                       activeEdis,
                                       inactiveEdis,
                                       pendingEdis,
                                       processedEdis,
                                       errorEdis,
                                     }: EdisDashboardContentProps) {
  return (
      <div className="space-y-4">
        <div className="w-full mt-2 mb-2">
          <div className="grid grid-cols-1 gap-4">
            <Card className="w-full border-l-8 border-black bg-sidebar min-h-[200px]">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row justify-between gap-12">
                  {/* Total de Arquivos */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xl font-bold">Total de Arquivos</span>
                    </div>
                    <div className="text-2xl font-semibold text-zinc-900 mb-3">{totalEdis}</div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-medium text-zinc-600">Ativos</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">{activeEdis}</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-xs font-medium text-zinc-600">Inativos</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">{inactiveEdis}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Processamento */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileCheck className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xl font-bold">Status Processamento</span>
                    </div>
                    <div className="text-2xl font-semibold text-zinc-900 mb-3">
                      {processedEdis + pendingEdis + errorEdis}
                    </div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-medium text-zinc-600">Processados</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">{processedEdis}</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-amber-500" />
                          <span className="text-xs font-medium text-zinc-600">Pendentes</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">{pendingEdis}</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-xs font-medium text-zinc-600">Erros</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">{errorEdis}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tipos de Arquivo */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xl font-bold">Tipos de Arquivo</span>
                    </div>
                    <div className="text-2xl font-semibold text-zinc-900 mb-3">{totalEdis}</div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-xs font-medium text-zinc-600">Remessa</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">
                        {Math.round(totalEdis * 0.6)}
                      </span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-purple-500" />
                          <span className="text-xs font-medium text-zinc-600">Retorno</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">
                        {Math.round(totalEdis * 0.4)}
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
