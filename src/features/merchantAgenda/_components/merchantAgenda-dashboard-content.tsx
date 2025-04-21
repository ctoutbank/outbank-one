"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
      <div className="w-full mb-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Estabelecimentos Card */}
          <Card className="bg-white min-w-[280px]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-600">
                    Estabelecimentos
                  </span>
                </div>
                <span className="text-2xl font-semibold text-zinc-900 ml-4">
                  {totalMerchant}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Vendas Card */}
          <Card className="bg-white min-w-[280px]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-600">
                    Vendas
                  </span>
                </div>
                <span className="text-2xl font-semibold text-zinc-900 ml-4">
                  {totalSales}
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
                    {formatCurrency(grossAmount)}
                  </span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium text-zinc-600">
                      Taxas
                    </span>
                  </div>
                  <span className="text-base font-semibold text-zinc-900">
                    {formatCurrency(taxAmount)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parcelas Card */}
          <Card className="bg-white min-w-[280px]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-zinc-500" />
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-zinc-600">
                      {view === "settled"
                        ? "Parcelas Liquidadas"
                        : "Parcelas Antecipadas"}
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
                </div>
                <span className="text-2xl font-semibold text-zinc-900 ml-4">
                  {view === "settled"
                    ? settledInstallments
                    : pendingInstallments}
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
                    {formatCurrency(
                      view === "settled"
                        ? settledGrossAmount
                        : anticipatedGrossAmount
                    )}
                  </span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium text-zinc-600">
                      Taxas
                    </span>
                  </div>
                  <span className="text-base font-semibold text-zinc-900">
                    {formatCurrency(
                      view === "settled"
                        ? settledTaxAmount
                        : anticipatedTaxAmount
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parcelas a Liquidar Card */}
          <Card className="bg-white min-w-[280px]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-600">
                    Parcelas a Liquidar
                  </span>
                </div>
                <span className="text-2xl font-semibold text-zinc-900 ml-4">
                  {toSettleInstallments}
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
                    {formatCurrency(toSettleGrossAmount)}
                  </span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span className="text-xs font-medium text-zinc-600">
                      Taxas
                    </span>
                  </div>
                  <span className="text-base font-semibold text-zinc-900">
                    {formatCurrency(toSettleTaxAmount)}
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
