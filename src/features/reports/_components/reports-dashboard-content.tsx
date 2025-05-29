"use client"

import { Card, CardContent } from "@/components/ui/card"
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
      <div className="space-y-4">
        <div className="w-full mt-2 mb-2">
          <div className="grid grid-cols-1 gap-4">
            <Card className="w-full border-l-8 border-black bg-sidebar min-h-[200px]">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row justify-between gap-12">
                  {/* Total de Relatórios */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xl font-bold">Total de Relatórios</span>
                    </div>
                    <div className="text-2xl font-semibold text-zinc-900 mb-3">{totalReports}</div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-xs font-medium text-zinc-600">Diários</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">
                        {recurrenceStats.daily}
                      </span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-purple-500" />
                          <span className="text-xs font-medium text-zinc-600">Semanais</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">
                        {recurrenceStats.weekly}
                      </span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-medium text-zinc-600">Mensais</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">
                        {recurrenceStats.monthly}
                      </span>
                      </div>
                    </div>
                  </div>

                  {/* Formatos */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileType className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xl font-bold">Formatos</span>
                    </div>
                    <div className="text-lg font-semibold text-zinc-900 mb-3">{formatStats.pdf + formatStats.excel}</div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-xs font-medium text-zinc-600">PDF</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">{formatStats.pdf}</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-xs font-medium text-zinc-600">Excel</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">
                        {formatStats.excel}
                      </span>
                      </div>
                    </div>
                  </div>

                  {/* Tipos de Relatório */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xl font-bold">Tipos de Relatório</span>
                    </div>
                    <div className="text-lg font-semibold text-zinc-900 mb-3">{typeStats.sales + typeStats.schedule}</div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-amber-500" />
                          <span className="text-xs font-medium text-zinc-600">Vendas</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">{typeStats.sales}</span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-xs font-medium text-zinc-600">Agenda</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">
                        {typeStats.schedule}
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
