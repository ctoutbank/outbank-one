"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
      <div className="w-full">
        <div className="w-full mt-2 mb-2">
          <Card className="w-full border-l-8 border-black bg-sidebar">
            <div className="flex items-center justify-between">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Arquivos EDI</CardTitle>
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
                {/* Total de Arquivos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg font-medium">Total de Arquivos</span>
                  </div>

                  <div className="grid gap-4">
                    <div className="text-center p-4 bg-background rounded-lg border">
                      <div className="text-2xl font-semibold text-zinc-900 mb-2">{totalEdis}</div>
                      <div className="text-sm text-muted-foreground">Total de Arquivos</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-emerald-500" />
                          <span className="text-sm font-medium text-zinc-600">Ativos</span>
                        </div>
                        <div className="text-lg font-semibold text-zinc-900">{activeEdis}</div>
                      </div>

                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-red-500" />
                          <span className="text-sm font-medium text-zinc-600">Inativos</span>
                        </div>
                        <div className="text-lg font-semibold text-zinc-900">{inactiveEdis}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Processamento */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-4">
                    <FileCheck className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg font-medium">Status Processamento</span>
                  </div>

                  <div className="grid gap-4">
                    <div className="text-center p-4 bg-background rounded-lg border">
                      <div className="text-2xl font-semibold text-zinc-900 mb-2">
                        {processedEdis + pendingEdis + errorEdis}
                      </div>
                      <div className="text-sm text-muted-foreground">Total em Processamento</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-emerald-500" />
                          <span className="text-sm font-medium text-zinc-600">Processados</span>
                        </div>
                        <div className="text-lg font-semibold text-zinc-900">{processedEdis}</div>
                      </div>

                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-amber-500" />
                          <span className="text-sm font-medium text-zinc-600">Pendentes</span>
                        </div>
                        <div className="text-lg font-semibold text-zinc-900">{pendingEdis}</div>
                      </div>

                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-red-500" />
                          <span className="text-sm font-medium text-zinc-600">Erros</span>
                        </div>
                        <div className="text-lg font-semibold text-zinc-900">{errorEdis}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tipos de Arquivo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg font-medium">Tipos de Arquivo</span>
                  </div>

                  <div className="grid gap-4">
                    <div className="text-center p-4 bg-background rounded-lg border">
                      <div className="text-2xl font-semibold text-zinc-900 mb-2">{totalEdis}</div>
                      <div className="text-sm text-muted-foreground">Total por Tipo</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500" />
                          <span className="text-sm font-medium text-zinc-600">Remessa</span>
                        </div>
                        <div className="text-lg font-semibold text-zinc-900">{Math.round(totalEdis * 0.6)}</div>
                      </div>

                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-purple-500" />
                          <span className="text-sm font-medium text-zinc-600">Retorno</span>
                        </div>
                        <div className="text-lg font-semibold text-zinc-900">{Math.round(totalEdis * 0.4)}</div>
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
