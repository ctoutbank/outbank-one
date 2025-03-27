"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getreportTypes } from "@/features/reports/server/reports";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";

type ReportsDashboardContentProps = {
  totalReports: number;
  dailyReports: number;
  weeklyReports: number;
  monthlyReports: number;
  pdfFormat: number;
  excelFormat: number;
  csvFormat: number;
};

export function ReportsDashboardContent({
  totalReports,
  dailyReports,
  weeklyReports,
  monthlyReports,
  pdfFormat,
  excelFormat,
  csvFormat,
}: ReportsDashboardContentProps) {
  const [reportTypes, setReportTypes] = useState<
    { code: string; name: string; count: number }[]
  >([]);

  useEffect(() => {
    async function loadData() {
      try {
        const types = await getreportTypes();

        // Simulando contagens para demonstração
        // Em um cenário real, você obteria esses dados do servidor
        const typesWithCount = types.map((type) => ({
          ...type,
          count: Math.floor(Math.random() * 10) + 1, // Simulando contagem aleatória entre 1 e 10
        }));

        setReportTypes(typesWithCount);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-4">
      <Separator />

      <div className="grid grid-cols-2 gap-4">
        {reportTypes.map((type) => (
          <Card key={type.code}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{type.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{type.count}</div>
              <p className="text-xs text-muted-foreground">
                relatórios cadastrados
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

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
                    {dailyReports}
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
                    {weeklyReports}
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
                    {monthlyReports}
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
                  <FileText className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-600">
                    Formatos
                  </span>
                </div>
                <span className="text-2xl font-semibold text-zinc-900 ml-4">
                  {pdfFormat + excelFormat + csvFormat}
                </span>
              </div>
              <Separator className="mb-3" />
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    <span className="text-xs font-medium text-zinc-600">
                      PDF
                    </span>
                  </div>
                  <span className="text-base font-semibold text-zinc-900">
                    {pdfFormat}
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
                    {excelFormat}
                  </span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium text-zinc-600">
                      CSV
                    </span>
                  </div>
                  <span className="text-base font-semibold text-zinc-900">
                    {csvFormat}
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
