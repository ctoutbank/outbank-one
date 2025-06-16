"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="w-full">
      <div className="w-full mt-2 mb-2">
        <Card className="w-full border-l-8 border-black bg-background">
          <div className="flex items-center justify-between">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Visão geral</CardTitle>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "America/Sao_Paulo",
                })}
              </p>
            </CardHeader>
          </div>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {/* Card de Estabelecimentos */}
              <Card className="bg-background border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-base font-medium">
                      Estabelecimentos
                    </span>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-zinc-900">
                      {totalMerchant}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Total de Estabelecimentos
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card de Vendas */}
              <Card className="bg-background border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-base font-medium">Vendas</span>
                  </div>

                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-zinc-900">
                      {totalSales}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Total de Vendas
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-zinc-600">
                          Valor Bruto
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-zinc-900">
                        {formatCurrency(grossAmount)}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span className="text-xs font-medium text-zinc-600">
                          Taxas
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-zinc-900">
                        {formatCurrency(taxAmount)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card de Parcelas Liquidadas/Antecipadas */}
              <Card className="bg-background border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium whitespace-nowrap">
                      {view === "settled"
                        ? "Parcelas Liquidadas"
                        : "Parcelas Antecipadas"}
                    </span>
                    <div className="flex gap-1 ml-auto">
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

                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-zinc-900">
                      {view === "settled"
                        ? settledInstallments
                        : pendingInstallments}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {view === "settled"
                        ? "Parcelas Liquidadas"
                        : "Parcelas Antecipadas"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-zinc-600">
                          Valor Bruto
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-zinc-900">
                        {formatCurrency(
                          view === "settled"
                            ? settledGrossAmount
                            : anticipatedGrossAmount
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span className="text-xs font-medium text-zinc-600">
                          Taxas
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-zinc-900">
                        {formatCurrency(
                          view === "settled"
                            ? settledTaxAmount
                            : anticipatedTaxAmount
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card de Parcelas a Liquidar */}
              <Card className="bg-background border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-base font-medium">
                      Parcelas a Liquidar
                    </span>
                  </div>

                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-zinc-900">
                      {toSettleInstallments}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Parcelas a Liquidar
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-zinc-600">
                          Valor Bruto
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-zinc-900">
                        {formatCurrency(toSettleGrossAmount)}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                        <span className="text-xs font-medium text-zinc-600">
                          Taxas
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-zinc-900">
                        {formatCurrency(toSettleTaxAmount)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
