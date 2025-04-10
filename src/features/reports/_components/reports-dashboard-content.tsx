"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
                  {totalReports}
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
                    {recurrenceStats.daily}
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
                    {recurrenceStats.weekly}
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
                    {recurrenceStats.monthly}
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
                    {formatStats.pdf}
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
                    {formatStats.excel}
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
                    {typeStats.sales}
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
                    {typeStats.schedule}
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
