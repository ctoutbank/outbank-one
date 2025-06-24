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
      <div className="w-full max-w-full">
        <div className="w-full mt-2 mb-2">
          <Card className="w-full border-l-8 border-black bg-white">
            <div className="flex items-center justify-between">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Arquivos EDI</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "America/Sao_Paulo",
                  })}
                </p>
              </CardHeader>
            </div>

            <CardContent className="p-6">
              <div className="flex flex-col xl:flex-row gap-4 w-full">
                {/* Card de Total de Arquivos */}
                <div className="flex-1 min-w-0">


                  <Card className="bg-background border h-full">
                    <CardContent className="p-4">
                      {/* Total de Arquivos */}
                      <div className="text-center mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-base text-sm font-medium">Total de Arquivos</span>
                        </div>
                        <div className="text-1xl font-bold text-zinc-900">{totalEdis}</div>
                        <div className="text-xs text-muted-foreground mt-1">Total de Arquivos</div>
                      </div>

                      {/* Status Ativo/Inativo */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-xs font-medium text-zinc-600">Ativos</span>
                          </div>
                          <div className="text-xs font-semibold text-zinc-900">{activeEdis}</div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="h-2 w-2 rounded-full bg-red-500" />
                            <span className="text-xs font-medium text-zinc-600">Inativos</span>
                          </div>
                          <div className="text-xs font-semibold text-zinc-900">{inactiveEdis}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Card de Status Processamento */}
                <div className="flex-1 min-w-0">


                  <Card className="bg-background border h-full">
                    <CardContent className="p-4">
                      {/* Total em Processamento */}
                      <div className="text-center mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <FileCheck className="h-4 w-4 text-muted-foreground" />
                          <span className="text-base text-sm font-medium">Status Processamento</span>
                        </div>
                        <div className="text-1xl font-bold text-zinc-900">{processedEdis + pendingEdis + errorEdis}</div>
                        <div className="text-xs text-muted-foreground mt-1">Total em Processamento</div>
                      </div>

                      {/* Status Detalhados */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="h-2 w-2 rounded-full bg-emerald-500" />
                            <span className="text-xs font-medium text-zinc-600">Processados</span>
                          </div>
                          <div className="text-xs font-semibold text-zinc-900">{processedEdis}</div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="h-2 w-2 rounded-full bg-amber-500" />
                            <span className="text-xs font-medium text-zinc-600">Pendentes</span>
                          </div>
                          <div className="text-xs font-semibold text-zinc-900">{pendingEdis}</div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="h-2 w-2 rounded-full bg-red-500" />
                            <span className="text-xs font-medium text-zinc-600">Erros</span>
                          </div>
                          <div className="text-xs font-semibold text-zinc-900">{errorEdis}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Card de Tipos de Arquivo */}
                <div className="flex-1 min-w-0">


                  <Card className="bg-background border h-full">
                    <CardContent className="p-4">
                      {/* Total por Tipo */}
                      <div className="text-center mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-base text-sm font-medium">Tipos de Arquivo</span>
                        </div>
                        <div className="text-1xl font-bold text-zinc-900">{totalEdis}</div>
                        <div className="text-xs text-muted-foreground mt-1">Total por Tipo</div>
                      </div>

                      {/* Tipos Detalhados */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            <span className="text-xs font-medium text-zinc-600">Remessa</span>
                          </div>
                          <div className="text-xs font-semibold text-zinc-900">{Math.round(totalEdis * 0.6)}</div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <div className="h-2 w-2 rounded-full bg-purple-500" />
                            <span className="text-xs font-medium text-zinc-600">Retorno</span>
                          </div>
                          <div className="text-xs font-semibold text-zinc-900">{Math.round(totalEdis * 0.4)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
