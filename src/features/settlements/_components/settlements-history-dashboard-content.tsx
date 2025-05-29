"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, FileCheck, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type SettlementsHistoryDashboardContentProps = {
    totalSettlements: number;
    totalGrossAmount: number;
    totalNetAmount: number;
    totalRestitutionAmount: number;
    pendingSettlements: number;
    approvedSettlements: number;
    processedSettlements: number;
    processingSettlements: number;
    errorSettlements: number;
    preApprovedSettlements: number;
};

export function SettlementsHistoryDashboardContent({
                                                       totalSettlements,
                                                       totalGrossAmount,
                                                       totalNetAmount,
                                                       totalRestitutionAmount,
                                                       pendingSettlements,
                                                       approvedSettlements,
                                                       processedSettlements,
                                                       processingSettlements,
                                                       errorSettlements,
                                                   }: SettlementsHistoryDashboardContentProps) {
    return (
        <div className="space-y-4">
            <div className="w-full mt-2 mb-2">
                <div className="grid grid-cols-1 gap-4">

                    <Card className="w-full border-l-8 border-black bg-sidebar min-h-[250px]">
                        <CardContent className="pt-6">
                            <div className="flex flex-col lg:flex-row justify-between gap-12">

                                {/* Total de Liquidações */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-xl font-bold">Total de Liquidações</span>
                                    </div>
                                    <div className="text-2xl font-semibold text-zinc-900 mb-3">
                                        {totalSettlements}
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="text-center">
                                            <div className="flex items-center justify-center gap-2 mb-1.5">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
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
                                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                                <span className="text-xs font-medium text-zinc-600">
                          Valor Líquido
                        </span>
                                            </div>
                                            <span className="text-base font-semibold text-zinc-900">
                        {formatCurrency(totalNetAmount)}
                      </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Status */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileCheck className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-xl font-bold">Status</span>
                                    </div>
                                    <div className="text-2xl font-semibold text-zinc-900 mb-3">
                                        {processingSettlements +
                                            errorSettlements +
                                            processedSettlements +
                                            pendingSettlements +
                                            approvedSettlements}
                                    </div>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="text-center min-w-[100px]">
                                            <div className="flex items-center justify-center gap-2 mb-1">
                                                <div className="h-2 w-2 rounded-full bg-orange-500" />
                                                <span className="text-xs font-medium text-zinc-600">
                          Processando
                        </span>
                                            </div>
                                            <span className="text-base font-semibold text-zinc-900">
                        {processingSettlements}
                      </span>
                                        </div>
                                        <div className="text-center min-w-[100px]">
                                            <div className="flex items-center justify-center gap-2 mb-1">
                                                <div className="h-2 w-2 rounded-full bg-orange-700" />
                                                <span className="text-xs font-medium text-zinc-600">
                          Pendente
                        </span>
                                            </div>
                                            <span className="text-base font-semibold text-zinc-900">
                        {pendingSettlements}
                      </span>
                                        </div>
                                        <div className="text-center min-w-[100px]">
                                            <div className="flex items-center justify-center gap-2 mb-1">
                                                <div className="h-2 w-2 rounded-full bg-blue-600" />
                                                <span className="text-xs font-medium text-zinc-600">
                          Pré-aprovado
                        </span>
                                            </div>
                                            <span className="text-base font-semibold text-zinc-900">
                        {approvedSettlements}
                      </span>
                                        </div>
                                        <div className="text-center min-w-[100px]">
                                            <div className="flex items-center justify-center gap-2 mb-1">
                                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                                <span className="text-xs font-medium text-zinc-600">
                          Aprovado
                        </span>
                                            </div>
                                            <span className="text-base font-semibold text-zinc-900">
                        {approvedSettlements}
                      </span>
                                        </div>
                                        <div className="text-center min-w-[100px]">
                                            <div className="flex items-center justify-center gap-2 mb-1">
                                                <div className="h-2 w-2 rounded-full bg-red-500" />
                                                <span className="text-xs font-medium text-zinc-600">
                          Erro
                        </span>
                                            </div>
                                            <span className="text-base font-semibold text-zinc-900">
                        {errorSettlements}
                      </span>
                                        </div>
                                        <div className="text-center min-w-[100px]">
                                            <div className="flex items-center justify-center gap-2 mb-1">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                <span className="text-xs font-medium text-zinc-600">
                          Liquidadas
                        </span>
                                            </div>
                                            <span className="text-base font-semibold text-zinc-900">
                        {processedSettlements}
                      </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Restituições */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Wallet className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-xl font-bold">Restituições</span>
                                    </div>
                                    <div className="text-2xl font-semibold text-zinc-900 mb-3">
                                        {formatCurrency(totalRestitutionAmount)}
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-2 mb-1.5">
                                            <div className="h-2 w-2 rounded-full bg-red-500" />
                                            <span className="text-xs font-medium text-zinc-600">
                        Valor Total
                      </span>
                                        </div>
                                        <span className="text-base font-semibold text-zinc-900">
                      {formatCurrency(totalRestitutionAmount)}
                    </span>
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
