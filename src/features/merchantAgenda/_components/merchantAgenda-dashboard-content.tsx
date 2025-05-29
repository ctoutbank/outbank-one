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
          <div className="grid grid-cols-1 gap-4">
            <Card className="w-full border-l-8 border-black bg-sidebar">
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
                    })}
                  </p>
                </CardHeader>
              </div>

              <CardContent className="p-6">
                <div className="flex flex-col xl:flex-row gap-6 w-full">
                  {/* Seção de Estabelecimentos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <span className="text-lg font-medium">Estabelecimentos</span>
                    </div>

                    <div className="grid gap-4">
                      <div className="text-center p-6 bg-background rounded-lg border">
                        <div className="text-3xl font-semibold text-zinc-900 mb-2">{totalMerchant}</div>
                        <div className="text-sm text-muted-foreground">Total de Estabelecimentos</div>
                      </div>
                    </div>
                  </div>

                  {/* Seção de Vendas */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-4">
                      <UserCheck className="h-5 w-5 text-muted-foreground" />
                      <span className="text-lg font-medium">Vendas</span>
                    </div>

                    <div className="grid gap-4">
                      <div className="text-center p-4 bg-background rounded-lg border">
                        <div className="text-2xl font-semibold text-zinc-900 mb-2">{totalSales}</div>
                        <div className="text-sm text-muted-foreground">Total de Vendas</div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-background rounded-lg border">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="h-3 w-3 rounded-full bg-emerald-500" />
                            <span className="text-sm font-medium text-zinc-600">Valor Bruto</span>
                          </div>
                          <div className="text-lg font-semibold text-zinc-900">{formatCurrency(grossAmount)}</div>
                        </div>

                        <div className="text-center p-4 bg-background rounded-lg border">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500" />
                            <span className="text-sm font-medium text-zinc-600">Taxas</span>
                          </div>
                          <div className="text-lg font-semibold text-zinc-900">{formatCurrency(taxAmount)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seção de Parcelas Liquidadas/Antecipadas */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="text-lg font-medium whitespace-nowrap">
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

                    <div className="grid gap-4">
                      <div className="text-center p-4 bg-background rounded-lg border">
                        <div className="text-2xl font-semibold text-zinc-900 mb-2">
                          {view === "settled" ? settledInstallments : pendingInstallments}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {view === "settled" ? "Parcelas Liquidadas" : "Parcelas Antecipadas"}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-background rounded-lg border">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="h-3 w-3 rounded-full bg-emerald-500" />
                            <span className="text-sm font-medium text-zinc-600">Valor Bruto</span>
                          </div>
                          <div className="text-lg font-semibold text-zinc-900">
                            {formatCurrency(view === "settled" ? settledGrossAmount : anticipatedGrossAmount)}
                          </div>
                        </div>

                        <div className="text-center p-4 bg-background rounded-lg border">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500" />
                            <span className="text-sm font-medium text-zinc-600">Taxas</span>
                          </div>
                          <div className="text-lg font-semibold text-zinc-900">
                            {formatCurrency(view === "settled" ? settledTaxAmount : anticipatedTaxAmount)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Seção de Parcelas a Liquidar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="text-lg font-medium whitespace-nowrap">Parcelas a Liquidar</span>
                    </div>

                    <div className="grid gap-4">
                      <div className="text-center p-4 bg-background rounded-lg border">
                        <div className="text-2xl font-semibold text-zinc-900 mb-2">{toSettleInstallments}</div>
                        <div className="text-sm text-muted-foreground">Parcelas a Liquidar</div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-background rounded-lg border">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="h-3 w-3 rounded-full bg-emerald-500" />
                            <span className="text-sm font-medium text-zinc-600">Valor Bruto</span>
                          </div>
                          <div className="text-lg font-semibold text-zinc-900">{formatCurrency(toSettleGrossAmount)}</div>
                        </div>

                        <div className="text-center p-4 bg-background rounded-lg border">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500" />
                            <span className="text-sm font-medium text-zinc-600">Taxas</span>
                          </div>
                          <div className="text-lg font-semibold text-zinc-900">{formatCurrency(toSettleTaxAmount)}</div>
                        </div>
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
