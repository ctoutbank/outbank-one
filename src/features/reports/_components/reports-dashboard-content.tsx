"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ReportStats, getReportStats } from "@/features/reports/server/reports";
import { Calendar, FileText, FileType } from "lucide-react";
import { useEffect, useState } from "react";

export function ReportsDashboardContent() {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const reportStats = await getReportStats();
        setStats(reportStats);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Carregando estatísticas...</div>;
  }

  if (!stats) {
    return (
      <div className="p-4 text-center">Nenhuma estatística disponível</div>
    );
  }

  return (
    <div className="space-y-4">
      <Separator />

      <div className="w-full mt-4 mb-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Reports Card */}
          <Card className="bg-white min-w-[280px]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-600">
                    Total de Relatórios
                  </span>
                </div>
                <span className="text-2xl font-semibold text-zinc-900 ml-4">
                  {stats.totalReports}
                </span>
              </div>
              <Separator className="mb-3" />
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium text-zinc-600">
                      Diários
                    </span>
                  </div>
                  <span className="text-base font-semibold text-zinc-900">
                    {stats.recurrenceStats.daily}
                  </span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    <span className="text-xs font-medium text-zinc-600">
                      Semanais
                    </span>
                  </div>
                  <span className="text-base font-semibold text-zinc-900">
                    {stats.recurrenceStats.weekly}
                  </span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-medium text-zinc-600">
                      Mensais
                    </span>
                  </div>
                  <span className="text-base font-semibold text-zinc-900">
                    {stats.recurrenceStats.monthly}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Format Card */}
          <Card className="bg-white min-w-[280px]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileType className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-600">
                    Formatos
                  </span>
                </div>
                <div className="ml-4 h-8"></div>
              </div>
              <Separator className="mb-3" />
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    <span className="text-xs font-medium text-zinc-600">
                      PDF
                    </span>
                  </div>
                  <span className="text-base font-semibold text-zinc-900">
                    {stats.formatStats.pdf}
                  </span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span className="text-xs font-medium text-zinc-600">
                      Excel
                    </span>
                  </div>
                  <span className="text-base font-semibold text-zinc-900">
                    {stats.formatStats.excel}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Types Card */}
          <Card className="bg-white min-w-[280px]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-600">
                    Tipos de Relatório
                  </span>
                </div>
                <div className="ml-4 h-8"></div>
              </div>
              <Separator className="mb-3" />
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span className="text-xs font-medium text-zinc-600">
                      Vendas
                    </span>
                  </div>
                  <span className="text-base font-semibold text-zinc-900">
                    {stats.typeStats.sales}
                  </span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium text-zinc-600">
                      Agenda
                    </span>
                  </div>
                  <span className="text-base font-semibold text-zinc-900">
                    {stats.typeStats.schedule}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
