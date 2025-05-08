"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowDownSquare,
  ArrowUpSquare,
  CircleDollarSign,
  Wallet,
} from "lucide-react";

type MerchantAgendaAdjustmentsDashboardContentProps = {
  totalAdjustments: number;

  totalSettledAdjustments: number;
  totalSettledAdjustmentsValue: number;
  settledCreditAdjustments: number;
  settledCreditAdjustmentsValue: number;
  settledDebitAdjustments: number;
  settledDebitAdjustmentsValue: number;

  totalPartiallySettledAdjustments: number;
  totalPartiallySettledAdjustmentsValue: number;
  partiallySettledCreditAdjustments: number;
  partiallySettledCreditAdjustmentsValue: number;
  partiallySettledDebitAdjustments: number;
  partiallySettledDebitAdjustmentsValue: number;

  totalPendingAdjustments: number;
  totalPendingAdjustmentsValue: number;
  pendingCreditAdjustments: number;
  pendingCreditAdjustmentsValue: number;
  pendingDebitAdjustments: number;
  pendingDebitAdjustmentsValue: number;

  firstTransactionDate?: string;
  lastTransactionDate?: string;
};

export function MerchantAdjustmentsDashboardContent({
  totalSettledAdjustments = 0,
  totalSettledAdjustmentsValue = 0,

  settledCreditAdjustmentsValue = 0,

  settledDebitAdjustmentsValue = 0,

  totalPartiallySettledAdjustmentsValue = 0,

  partiallySettledCreditAdjustmentsValue = 0,

  partiallySettledDebitAdjustmentsValue = 0,

  totalPendingAdjustmentsValue = 0,

  pendingCreditAdjustmentsValue = 0,

  pendingDebitAdjustmentsValue = 0,

  firstTransactionDate,
  lastTransactionDate,
}: MerchantAgendaAdjustmentsDashboardContentProps) {
  // Formatação das datas de transação para exibição
  const formattedFirstDate = firstTransactionDate
    ? new Date(firstTransactionDate).toLocaleDateString("pt-BR")
    : "-";
  const formattedLastDate = lastTransactionDate
    ? new Date(lastTransactionDate).toLocaleDateString("pt-BR")
    : "-";

  const periodText = `${formattedFirstDate} - ${formattedLastDate}`;
  console.log(periodText);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center flex-wrap gap-4 w-full">
        {/* Total de Ajustes Card */}
        <Card className="bg-white min-w-[280px] w-[280px] h-[135px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Ajustes
                </span>
              </div>
            </div>
            <Separator className="mb-3" />
            <div className="text-center">
              <span className="text-sm font-semibold text-zinc-900">
                {totalSettledAdjustments}
              </span>
            </div>
          </CardContent>
        </Card>
        {/* Ajustes Liquidados Card */}
        <Card className="bg-white min-w-[280px] w-[280px] h-[135px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Ajustes Liquidados
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-semibold text-zinc-900 whitespace-nowrap">
                  {formatCurrency(totalSettledAdjustmentsValue)}
                </span>
              </div>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-1">
                  <ArrowUpSquare className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600 truncate">
                    Crédito
                  </span>
                </div>
                <div className="text-xs font-semibold text-zinc-900">
                  {formatCurrency(settledCreditAdjustmentsValue)}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-1">
                  <ArrowDownSquare className="h-3 w-3 text-red-500" />
                  <span className="text-xs font-medium text-zinc-600 truncate">
                    Débito
                  </span>
                </div>
                <div className="text-xs font-semibold text-zinc-900">
                  {formatCurrency(settledDebitAdjustmentsValue)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Ajustes Parcialmente Liquidados Card */}
        <Card className="bg-white min-w-[280px] w-[280px] h-[135px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Ajustes Parciais
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-semibold text-zinc-900 whitespace-nowrap">
                  {formatCurrency(totalPartiallySettledAdjustmentsValue)}
                </span>
              </div>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-1">
                  <ArrowUpSquare className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600 truncate">
                    Crédito
                  </span>
                </div>
                <div className="text-xs font-semibold text-zinc-900">
                  {formatCurrency(partiallySettledCreditAdjustmentsValue)}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-1">
                  <ArrowDownSquare className="h-3 w-3 text-red-500" />
                  <span className="text-xs font-medium text-zinc-600 truncate">
                    Débito
                  </span>
                </div>
                <div className="text-xs font-semibold text-zinc-900">
                  {formatCurrency(partiallySettledDebitAdjustmentsValue)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Ajustes a Liquidar Card */}
        <Card className="bg-white min-w-[280px] w-[280px] h-[135px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Ajustes a Liquidar
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-semibold text-zinc-900 whitespace-nowrap">
                  {formatCurrency(totalPendingAdjustmentsValue)}
                </span>
              </div>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-1">
                  <ArrowUpSquare className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600 truncate">
                    Crédito
                  </span>
                </div>
                <div className="text-xs font-semibold text-zinc-900">
                  {formatCurrency(pendingCreditAdjustmentsValue)}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-1">
                  <ArrowDownSquare className="h-3 w-3 text-red-500" />
                  <span className="text-xs font-medium text-zinc-600 truncate">
                    Débito
                  </span>
                </div>
                <div className="text-xs font-semibold text-zinc-900">
                  {formatCurrency(pendingDebitAdjustmentsValue)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
