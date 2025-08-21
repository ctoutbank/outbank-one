// Start of Selection
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Activity, DollarSign, FileText } from "lucide-react";

interface FinancialAdjustmentsDashboardContentProps {
  totalAdjustments: number;
  activeAdjustments: number;
  totalValue: number;
  typeStats: { [key: string]: number };
  reasonStats: { [key: string]: number };
}

export function FinancialAdjustmentsDashboardContent({
  totalAdjustments,
  activeAdjustments,
  totalValue,
}: FinancialAdjustmentsDashboardContentProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="w-full max-w-full">
      <div className="w-full mt-2 mb-2">
        <Card className="w-full bg-transparent">
          <CardContent className="p-6">
            <div className="flex flex-col xl:flex-row gap-4 w-full">
              <div className="flex-1 min-w-0">
                <Card className="bg-transparent border h-[180px] rounded-lg">
                  <CardContent className="p-4">
                    <div className="text-center mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-base font-medium">
                          Total de Ajustes
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-zinc-900">
                        {totalAdjustments}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Todos os ajustes cadastrados
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex-1 min-w-0">
                <Card className="bg-transparent border h-[180px] rounded-lg">
                  <CardContent className="p-4">
                    <div className="text-center mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span className="text-base font-medium">
                          Ajustes Ativos
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-zinc-900">
                        {activeAdjustments}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Ajustes atualmente ativos
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex-1 min-w-0">
                <Card className="bg-transparent border h-[180px] rounded-lg">
                  <CardContent className="p-4">
                    <div className="text-center mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-base font-medium">
                          Valor Total
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-zinc-900">
                        {formatCurrency(totalValue)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Soma dos ajustes ativos
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
