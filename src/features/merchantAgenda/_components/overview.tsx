"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export type MerchantAgendaOverviewProps = {
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

type ViewType = "settled" | "anticipated";

export default function MerchantAgendaOverview({
  totalMerchant,
  date,
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
}: MerchantAgendaOverviewProps) {
  const [view, setView] = useState<ViewType>("settled");

  const toggleView = () => {
    setView(view === "settled" ? "anticipated" : "settled");
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Calendar className="h-6 w-6" />
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold tracking-wide">HOJE</span>
          <span className="text-sm text-zinc-500">{formatDate(date)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card className="bg-gradient-to-br from-black to-zinc-800 text-white">
          <CardHeader className="py-4">
            <CardTitle className="text-base font-semibold">Estabelecimentos</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-bold">{totalMerchant}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Vendas</CardTitle>
              <span className="text-xl font-bold">{totalSales}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 pb-4">
            <div className="grid grid-cols-2">
              <div className="text-sm text-zinc-400">Valor Total Bruto</div>
              <div className="text-right">{formatCurrency(grossAmount)}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-sm text-zinc-400">Valor Total em Taxas</div>
              <div className="text-right">{formatCurrency(taxAmount)}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-zinc-800 to-zinc-700 text-white">
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleView}
                  className="p-1.5 hover:bg-zinc-600/50 rounded-full transition-all duration-200"
                  aria-label="Previous view"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <CardTitle className="text-base font-semibold">
                  {view === "settled"
                    ? "Parcelas Liquidadas"
                    : "Parcelas Antecipadas"}
                </CardTitle>
                <button
                  onClick={toggleView}
                  className="p-1.5 hover:bg-zinc-600/50 rounded-full transition-all duration-200"
                  aria-label="Next view"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <span className="text-xl font-bold">
                {view === "settled" ? settledInstallments : pendingInstallments}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 pb-4">
            <div className="grid grid-cols-2">
              <div className="text-sm text-zinc-400">Valor Total Bruto</div>
              <div className="text-right">
                {formatCurrency(
                  view === "settled"
                    ? settledGrossAmount
                    : anticipatedGrossAmount
                )}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-sm text-zinc-400">Valor Total em Taxas</div>
              <div className="text-right">
                {formatCurrency(
                  view === "settled" ? settledTaxAmount : anticipatedTaxAmount
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-zinc-700 to-zinc-600 text-white">
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Parcelas a Liquidar</CardTitle>
              <span className="text-xl font-bold">{toSettleInstallments}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 pb-4">
            <div className="grid grid-cols-2">
              <div className="text-sm text-zinc-400">Valor Total Bruto</div>
              <div className="text-right">
                {formatCurrency(toSettleGrossAmount)}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-sm text-zinc-400">Valor Total em Taxas</div>
              <div className="text-right">
                {formatCurrency(toSettleTaxAmount)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
