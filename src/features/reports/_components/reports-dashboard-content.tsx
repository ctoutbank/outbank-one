"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, FileText, FileType } from "lucide-react"

type ReportsDashboardContentProps = {
  totalReports: number
  recurrenceStats: {
    daily: number
    weekly: number
    monthly: number
  }
  formatStats: {
    pdf: number
    excel: number
  }
  typeStats: {
    sales: number
    schedule: number
  }
}

export function ReportsDashboardContent({
                                          totalReports,
                                          recurrenceStats,
                                          formatStats,
                                          typeStats,
                                        }: ReportsDashboardContentProps) {
  return (
      <div className="w-full">
        <div className="w-full mt-2 mb-2">
          <Card className="w-full border-l-8 border-black bg-sidebar">
            <div className="flex items-center justify-between">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Relatórios</CardTitle>
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
                {/* Total de Relatórios */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg font-medium">Total de Relatórios</span>
                  </div>

                  <div className="grid gap-4">
                    <div className="text-center p-4 bg-background rounded-lg border">
                      <div className="text-2xl font-semibold text-zinc-900 mb-2">{totalReports}</div>
                      <div className="text-sm text-muted-foreground">Total de Relatórios</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500" />
                          <span className="text-sm font-medium text-zinc-600">Diários</span>
                        </div>
                        <div className="text-lg font-semibold text-zinc-900">{recurrenceStats.daily}</div>
                      </div>

                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-purple-500" />
                          <span className="text-sm font-medium text-zinc-600">Semanais</span>
                        </div>
                        <div className="text-lg font-semibold text-zinc-900">{recurrenceStats.weekly}</div>
                      </div>

                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-emerald-500" />
                          <span className="text-sm font-medium text-zinc-600">Mensais</span>
                        </div>
                        <div className="text-lg font-semibold text-zinc-900">{recurrenceStats.monthly}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formatos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-4">
                    <FileType className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg font-medium">Formatos</span>
                  </div>

                  <div className="grid gap-4">
                    <div className="text-center p-4 bg-background rounded-lg border">
                      <div className="text-2xl font-semibold text-zinc-900 mb-2">
                        {formatStats.pdf + formatStats.excel}
                      </div>
                      <div className="text-sm text-muted-foreground">Total por Formato</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-red-500" />
                          <span className="text-sm font-medium text-zinc-600">PDF</span>
                        </div>
                        <div className="text-lg font-semibold text-zinc-900">{formatStats.pdf}</div>
                      </div>

                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-green-500" />
                          <span className="text-sm font-medium text-zinc-600">Excel</span>
                        </div>
                        <div className="text-lg font-semibold text-zinc-900">{formatStats.excel}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tipos de Relatório */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg font-medium">Tipos de Relatório</span>
                  </div>

                  <div className="grid gap-4">
                    <div className="text-center p-4 bg-background rounded-lg border">
                      <div className="text-2xl font-semibold text-zinc-900 mb-2">
                        {typeStats.sales + typeStats.schedule}
                      </div>
                      <div className="text-sm text-muted-foreground">Total por Tipo</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-amber-500" />
                          <span className="text-sm font-medium text-zinc-600">Vendas</span>
                        </div>
                        <div className="text-lg font-semibold text-zinc-900">{typeStats.sales}</div>
                      </div>

                      <div className="text-center p-3 bg-background rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500" />
                          <span className="text-sm font-medium text-zinc-600">Agenda</span>
                        </div>
                        <div className="text-lg font-semibold text-zinc-900">{typeStats.schedule}</div>
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
