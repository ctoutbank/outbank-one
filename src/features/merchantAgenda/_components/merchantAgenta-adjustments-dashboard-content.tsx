"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowDownSquare, ArrowUpSquare, CircleDollarSign } from "lucide-react";

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
    <div className="w-full">
      <div className="w-full mt-2">
        <Card className="w-full border-none bg-transparent">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Card de Ajustes Liquidados */}
              <Card className="bg-background border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowUpSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-base font-medium">Liquidados</span>
                  </div>

                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-zinc-900">
                      {totalSettledAdjustments}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Total de Ajustes
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-zinc-600">
                          Créditos
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-zinc-900">
                        {formatCurrency(settledCreditAdjustmentsValue)}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <span className="text-xs font-medium text-zinc-600">
                          Débitos
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-zinc-900">
                        {formatCurrency(settledDebitAdjustmentsValue)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card de Ajustes Parcialmente Liquidados */}
              <Card className="bg-background border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Parcialmente Liquidados
                    </span>
                  </div>

                  <div className="text-center mb-4">
                    <div className="text-xl font-bold text-zinc-900">
                      {formatCurrency(totalPartiallySettledAdjustmentsValue)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Valor Total
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-zinc-600">
                          Créditos
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-zinc-900">
                        {formatCurrency(partiallySettledCreditAdjustmentsValue)}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <span className="text-xs font-medium text-zinc-600">
                          Débitos
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-zinc-900">
                        {formatCurrency(partiallySettledDebitAdjustmentsValue)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card de Ajustes Pendentes */}
              <Card className="bg-background border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ArrowDownSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-base font-medium">Pendentes</span>
                  </div>

                  <div className="text-center mb-4">
                    <div className="text-xl font-bold text-zinc-900">
                      {formatCurrency(totalPendingAdjustmentsValue)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Valor Total
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-zinc-600">
                          Créditos
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-zinc-900">
                        {formatCurrency(pendingCreditAdjustmentsValue)}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <span className="text-xs font-medium text-zinc-600">
                          Débitos
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-zinc-900">
                        {formatCurrency(pendingDebitAdjustmentsValue)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
