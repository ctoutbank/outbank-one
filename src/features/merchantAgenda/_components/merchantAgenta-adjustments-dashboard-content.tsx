"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowDownSquare,
  ArrowUpSquare,
  CircleDollarSign,
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
                                                      //totalSettledAdjustmentsValue = 0,
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
  const formattedFirstDate = firstTransactionDate
      ? new Date(firstTransactionDate).toLocaleDateString("pt-BR")
      : "-";
  const formattedLastDate = lastTransactionDate
      ? new Date(lastTransactionDate).toLocaleDateString("pt-BR")
      : "-";

  const periodText = `${formattedFirstDate} - ${formattedLastDate}`;

  return (
      <div className="space-y-4">
        <div className="w-full mt-2 mb-2">
          <Card className="w-full border-l-8 border-black bg-sidebar min-h-[200px]">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row justify-between gap-12">
                {/* Ajustes Liquidados */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpSquare className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xl font-bold">Liquidados</span>
                  </div>
                  <div className="text-2xl font-semibold text-zinc-900 mb-3">
                    {totalSettledAdjustments}
                  </div>
                  <div className="flex gap-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1.5">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-zinc-600">Créditos</span>
                      </div>
                      <span className="text-base font-semibold text-zinc-900">
                      {formatCurrency(settledCreditAdjustmentsValue)}
                    </span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1.5">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <span className="text-xs font-medium text-zinc-600">Débitos</span>
                      </div>
                      <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">
                      {formatCurrency(settledDebitAdjustmentsValue)}
                    </span>
                    </div>
                  </div>
                </div>

                {/* Ajustes Parcialmente Liquidados */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CircleDollarSign className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xl font-bold whitespace-nowrap">Parcialmente Liquidados</span>
                  </div>
                  <div className="text-2xl font-semibold text-zinc-900 mb-3">
                    {formatCurrency(totalPartiallySettledAdjustmentsValue)}
                  </div>
                  <div className="flex gap-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1.5">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-zinc-600">Créditos</span>
                      </div>
                      <span className="text-base font-semibold text-zinc-900">
                      {formatCurrency(partiallySettledCreditAdjustmentsValue)}
                    </span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1.5">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <span className="text-xs font-medium text-zinc-600">Débitos</span>
                      </div>
                      <span className="text-base font-semibold text-zinc-900 inline">
                      {formatCurrency(partiallySettledDebitAdjustmentsValue)}
                    </span>
                    </div>
                  </div>
                </div>

                {/* Ajustes Pendentes */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowDownSquare className="h-5 w-5 text-muted-foreground" />
                    <span className="text-xl font-bold whitespace-nowrap">Pendentes</span>
                  </div>
                  <div className="text-2xl font-semibold text-zinc-900 mb-3">
                    {formatCurrency(totalPendingAdjustmentsValue)}
                  </div>
                  <div className="flex gap-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1.5">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-zinc-600">Créditos</span>
                      </div>
                      <span className="text-base font-semibold text-zinc-900">
                      {formatCurrency(pendingCreditAdjustmentsValue)}
                    </span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1.5">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <span className="text-xs font-medium text-zinc-600">Débitos</span>
                      </div>
                      <span className="text-base font-semibold text-zinc-900">
                      {formatCurrency(pendingDebitAdjustmentsValue)}
                    </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-sm text-muted-foreground text-right">
                Período: {periodText}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
