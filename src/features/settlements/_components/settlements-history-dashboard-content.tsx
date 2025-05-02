"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, FileCheck, Wallet } from "lucide-react";

type SettlementsHistoryDashboardContentProps = {
  totalSettlements: number;
  totalGrossAmount: number;
  totalNetAmount: number;
  totalRestitutionAmount: number;
  pendingSettlements: number;
  approvedSettlements: number;
  processedSettlements: number;
};

export function SettlementsHistoryDashboardContent({
  totalSettlements,
  totalGrossAmount,
  totalNetAmount,
  totalRestitutionAmount,
  pendingSettlements,
  approvedSettlements,
  processedSettlements,
}: SettlementsHistoryDashboardContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center flex-wrap gap-4 ">
        {/* Total Settlements Card */}
        <Card className="bg-white min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Total de Liquidações
                </span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900 ml-4">
                {totalSettlements}
              </span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Valor Bruto
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {formatCurrency(totalGrossAmount)}
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Valor Líquido
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {formatCurrency(totalNetAmount)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card className="bg-white min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Status
                </span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900 ml-4">
                {pendingSettlements +
                  approvedSettlements +
                  processedSettlements}
              </span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Pendentes
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {pendingSettlements}
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-700" />
                  <span className="text-xs font-medium text-zinc-600">
                    Aprovadas
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {approvedSettlements}
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Processadas
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {processedSettlements}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Restitution Card */}
        <Card className="bg-white min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Restituições
                </span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900 ml-4">
                {formatCurrency(totalRestitutionAmount)}
              </span>
            </div>
            <Separator className="mb-3" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <span className="text-xs font-medium text-zinc-600">
                  Valor Total
                </span>
              </div>
              <span className="text-base font-semibold text-zinc-900">
                {formatCurrency(totalRestitutionAmount)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
