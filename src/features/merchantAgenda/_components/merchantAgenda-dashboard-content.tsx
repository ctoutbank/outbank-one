"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Users,
} from "lucide-react";
import { useState } from "react";

type ViewType = "settled" | "anticipated";

type MerchantAgendaDashboardContentProps = {
  totalMerchant: number;
  date: Date;
  totalSales: number;
  grossAmount: number;
  taxAmount: number;
  settledInstallments: number;
  pendingInstallments: number;
  settledGrossAmount: number;
  settledTaxAmount: number;
  anticipatedGrossAmount: number;
  anticipatedTaxAmount: number;
  toSettleInstallments: number;
  toSettleGrossAmount: number;
  toSettleTaxAmount: number;
};

export function MerchantAgendaDashboardContent({
                                                 totalMerchant,
                                                 totalSales,
                                                 grossAmount,
                                                 taxAmount,
                                                 settledInstallments,
                                                 pendingInstallments,
                                                 settledGrossAmount,
                                                 settledTaxAmount,
                                                 anticipatedGrossAmount,
                                                 anticipatedTaxAmount,
                                                 toSettleInstallments,
                                                 toSettleGrossAmount,
                                                 toSettleTaxAmount,
                                               }: MerchantAgendaDashboardContentProps) {
  const [view, setView] = useState<ViewType>("settled");

  const toggleView = () => {
    setView(view === "settled" ? "anticipated" : "settled");
  };

  return (
      <div className="space-y-4">
        <div className="w-full mt-2 mb-2">
          <div className="grid grid-cols-1 gap-4">
            <Card className="w-full border-l-8 border-black bg-sidebar min-h-[200px]">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row justify-between gap-12">

                  {/* Estabelecimentos */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xl font-bold">Estabelecimentos</span>
                    </div>
                    <div className="text-2xl font-semibold text-zinc-900 mb-3">
                      {totalMerchant}
                    </div>
                  </div>

                  {/* Vendas */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <UserCheck className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xl font-bold">Vendas</span>
                    </div>
                    <div className="text-2xl font-semibold text-zinc-900 mb-3">
                      {totalSales}
                    </div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-medium text-zinc-600">Valor Bruto</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">
                        {formatCurrency(grossAmount)}
                      </span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-xs font-medium text-zinc-600">Taxas</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900 whitespace-nowrap">
                        {formatCurrency(taxAmount)}
                      </span>
                      </div>
                    </div>
                  </div>

                  {/* Parcelas Liquidadas / Antecipadas */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xl font-bold whitespace-nowrap">
                      {view === "settled" ? "Parcelas Liquidadas" : "Parcelas Antecipadas"}
                    </span>
                      <div className="flex gap-1 ml-2">
                        <ChevronLeft
                            className="h-4 w-4 text-zinc-400 cursor-pointer hover:text-zinc-600"
                            onClick={toggleView}
                        />
                        <ChevronRight
                            className="h-4 w-4 text-zinc-400 cursor-pointer hover:text-zinc-600"
                            onClick={toggleView}
                        />
                      </div>
                    </div>
                    <div className="text-2xl font-semibold text-zinc-900 mb-3">
                      {view === "settled" ? settledInstallments : pendingInstallments}
                    </div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-medium text-zinc-600">Valor Bruto</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900">
                        {formatCurrency(
                            view === "settled" ? settledGrossAmount : anticipatedGrossAmount
                        )}
                      </span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-xs font-medium text-zinc-600">Taxas</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900">
                        {formatCurrency(
                            view === "settled" ? settledTaxAmount : anticipatedTaxAmount
                        )}
                      </span>
                      </div>
                    </div>
                  </div>

                  {/* Parcelas a Liquidar */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xl font-bold whitespace-nowrap">Parcelas a Liquidar</span>
                    </div>
                    <div className="text-2xl font-semibold text-zinc-900 mb-3">
                      {toSettleInstallments}
                    </div>
                    <div className="flex gap-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-medium text-zinc-600">Valor Bruto</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900">
                        {formatCurrency(toSettleGrossAmount)}
                      </span>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <span className="text-xs font-medium text-zinc-600">Taxas</span>
                        </div>
                        <span className="text-base font-semibold text-zinc-900">
                        {formatCurrency(toSettleTaxAmount)}
                      </span>
                      </div>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}
