"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Calendar, FileText, FileType } from "lucide-react";

type ReportsDashboardContentProps = {
  totalReports: number;
  recurrenceStats: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  formatStats: {
    pdf: number;
    excel: number;
  };
  typeStats: {
    sales: number;
    schedule: number;
  };
};

export function ReportsDashboardContent({
  totalReports,
  recurrenceStats,
  formatStats,
  typeStats,
}: ReportsDashboardContentProps) {
  return (
    <div className="w-full max-w-full">
      <div className="w-full mt-2 mb-2">
        <Card className="w-full border-l-8 border-black bg-transparent">
          <CardContent className="p-6">
            <div className="flex flex-col xl:flex-row gap-4 w-full">
              {/* Card de Total de Relatórios */}
              <div className="flex-1 min-w-0">
                <Card className="bg-background border h-[180px] rounded-lg">
                  <CardContent className="p-4">
                    {/* Total de Relatórios */}
                    <div className="text-center mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-base font-medium">
                          Total de Relatórios
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-zinc-900">
                        {totalReports}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Total de Relatórios
                      </div>
                    </div>

                    {/* Detalhes de Recorrência */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-sm font-medium text-zinc-600">
                            Diários
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-zinc-900">
                          {recurrenceStats.daily}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <div className="h-2 w-2 rounded-full bg-purple-500" />
                          <span className="text-sm font-medium text-zinc-600">
                            Semanais
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-zinc-900">
                          {recurrenceStats.weekly}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-sm font-medium text-zinc-600">
                            Mensais
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-zinc-900">
                          {recurrenceStats.monthly}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Card de Formatos */}
              <div className="flex-1 min-w-0">
                <Card className="bg-background border h-[180px] rounded-lg">
                  <CardContent className="p-4">
                    {/* Total por Formato */}
                    <div className="text-center mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileType className="h-4 w-4 text-muted-foreground" />
                        <span className="text-base font-medium">Formatos</span>
                      </div>
                      <div className="text-2xl font-bold text-zinc-900">
                        {formatStats.pdf + formatStats.excel}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Total por Formato
                      </div>
                    </div>

                    {/* Detalhes de Formato */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <span className="text-sm font-medium text-zinc-600">
                            PDF
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-zinc-900">
                          {formatStats.pdf}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-sm font-medium text-zinc-600">
                            Excel
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-zinc-900">
                          {formatStats.excel}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Card de Tipos de Relatório */}
              <div className="flex-1 min-w-0">
                <Card className="bg-background border h-[180px] rounded-lg">
                  <CardContent className="p-4">
                    {/* Total por Tipo */}
                    <div className="text-center mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-base font-medium">
                          Tipos de Relatório
                        </span>
                      </div>

                      <div className="text-2xl font-bold text-zinc-900">
                        {typeStats.sales + typeStats.schedule}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Total por Tipo
                      </div>
                    </div>

                    {/* Detalhes de Tipo */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <div className="h-2 w-2 rounded-full bg-amber-500" />
                          <span className="text-sm font-medium text-zinc-600">
                            Vendas
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-zinc-900">
                          {typeStats.sales}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-sm font-medium text-zinc-600">
                            Agenda
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-zinc-900">
                          {typeStats.schedule}
                        </div>
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
  );
}
