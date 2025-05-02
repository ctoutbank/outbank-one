"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowDownSquare,
  ArrowUpSquare,
  Calendar,
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
  totalAdjustments = 77,

  totalSettledAdjustments = 4,
  totalSettledAdjustmentsValue = 6310.42,
  settledCreditAdjustments = 0,
  settledCreditAdjustmentsValue = 0,
  settledDebitAdjustments = 4,
  settledDebitAdjustmentsValue = 6310.42,

  totalPartiallySettledAdjustments = 0,
  totalPartiallySettledAdjustmentsValue = 0,
  partiallySettledCreditAdjustments = 0,
  partiallySettledCreditAdjustmentsValue = 0,
  partiallySettledDebitAdjustments = 0,
  partiallySettledDebitAdjustmentsValue = 0,

  totalPendingAdjustments = 1,
  totalPendingAdjustmentsValue = 1498.5,
  pendingCreditAdjustments = 0,
  pendingCreditAdjustmentsValue = 0,
  pendingDebitAdjustments = 1,
  pendingDebitAdjustmentsValue = 1498.5,

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

  return (
    <div className="space-y-4">
      <div className="flex items-center flex-wrap gap-4">
        {/* Período Card */}
        <Card className="bg-white min-w-[280px] w-4 h-[135px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Período
                </span>
              </div>
            </div>
            <Separator className="mb-3" />
            <div className="text-center">
              <span className="text-sm font-semibold text-zinc-900">
                {periodText}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total de Ajustes Card */}
        <Card className="bg-black text-white min-w-[280px] w-4 h-[135px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span className="text-sm font-medium">Ajustes</span>
              </div>
              <span className="text-2xl font-semibold ml-4">
                {totalAdjustments}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Ajustes Liquidados Card */}
        <Card className="bg-white min-w-[280px] w-4 h-[135px]">
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
                <span className="text-sm text-zinc-500">
                  {totalSettledAdjustments}
                </span>
              </div>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <ArrowUpSquare className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    A crédito
                  </span>
                </div>
                <span className="text-sm font-semibold text-zinc-900 whitespace-nowrap">
                  {formatCurrency(settledCreditAdjustmentsValue)}
                </span>
                <div className="text-xs text-zinc-500">
                  {settledCreditAdjustments}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <ArrowDownSquare className="h-3 w-3 text-red-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    A débito
                  </span>
                </div>
                <span className="text-sm font-semibold text-zinc-900 whitespace-nowrap">
                  {formatCurrency(settledDebitAdjustmentsValue)}
                </span>
                <div className="text-xs text-zinc-500">
                  {settledDebitAdjustments}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ajustes Parcialmente Liquidados Card */}
        <Card className="bg-white min-w-[280px] w-4 h-[135px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Ajustes Parcialmente Liquidados
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-semibold text-zinc-900 whitespace-nowrap">
                  {formatCurrency(totalPartiallySettledAdjustmentsValue)}
                </span>
                <span className="text-sm text-zinc-500">
                  {totalPartiallySettledAdjustments}
                </span>
              </div>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <ArrowUpSquare className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    A crédito
                  </span>
                </div>
                <span className="text-sm font-semibold text-zinc-900 whitespace-nowrap">
                  {formatCurrency(partiallySettledCreditAdjustmentsValue)}
                </span>
                <div className="text-xs text-zinc-500">
                  {partiallySettledCreditAdjustments}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <ArrowDownSquare className="h-3 w-3 text-red-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    A débito
                  </span>
                </div>
                <span className="text-sm font-semibold text-zinc-900 whitespace-nowrap">
                  {formatCurrency(partiallySettledDebitAdjustmentsValue)}
                </span>
                <div className="text-xs text-zinc-500">
                  {partiallySettledDebitAdjustments}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ajustes a Liquidar Card */}
        <Card className="bg-white min-w-[280px] w-4 h-[135px]">
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
                <span className="text-sm text-zinc-500">
                  {totalPendingAdjustments}
                </span>
              </div>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <ArrowUpSquare className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    A crédito
                  </span>
                </div>
                <span className="text-sm font-semibold text-zinc-900 whitespace-nowrap">
                  {formatCurrency(pendingCreditAdjustmentsValue)}
                </span>
                <div className="text-xs text-zinc-500">
                  {pendingCreditAdjustments}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <ArrowDownSquare className="h-3 w-3 text-red-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    A débito
                  </span>
                </div>
                <span className="text-sm font-semibold text-zinc-900 whitespace-nowrap">
                  {formatCurrency(pendingDebitAdjustmentsValue)}
                </span>
                <div className="text-xs text-zinc-500">
                  {pendingDebitAdjustments}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
