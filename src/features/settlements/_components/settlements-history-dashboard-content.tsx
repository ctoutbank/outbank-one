"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <div className="w-full">
            <div className="w-full mt-2 mb-2">
                <div className="grid grid-cols-1 gap-4">
                    <Card className="w-full border-l-8 border-black bg-sidebar">
                        <div className="flex items-center justify-between">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Liquidações</CardTitle>
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
                                {/* Seção de Liquidações */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-lg font-medium">Total de Liquidações</span>
                                    </div>

                                    <div className="grid gap-4">
                                        <div className="text-center p-4 bg-background rounded-lg border">
                                            <div className="text-2xl font-semibold text-zinc-900 mb-2">{totalSettlements}</div>
                                            <div className="text-sm text-muted-foreground">Total de Liquidações</div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <div className="text-center p-4 bg-background rounded-lg border">
                                                <div className="flex items-center justify-center gap-2 mb-2">
                                                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                                    <span className="text-sm font-medium text-zinc-600">Valor Bruto</span>
                                                </div>
                                                <div className="text-lg font-semibold text-zinc-900">{formatCurrency(totalGrossAmount)}</div>
                                            </div>

                                            <div className="text-center p-4 bg-background rounded-lg border">
                                                <div className="flex items-center justify-center gap-2 mb-2">
                                                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                                                    <span className="text-sm font-medium text-zinc-600">Valor Líquido</span>
                                                </div>
                                                <div className="text-lg font-semibold text-zinc-900">{formatCurrency(totalNetAmount)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Seção de Status */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FileCheck className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-lg font-medium">Status</span>
                                    </div>

                                    <div className="grid gap-4">
                                        <div className="text-center p-4 bg-background rounded-lg border">
                                            <div className="text-2xl font-semibold text-zinc-900 mb-2">
                                                {processingSettlements +
                                                    errorSettlements +
                                                    processedSettlements +
                                                    pendingSettlements +
                                                    approvedSettlements}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Total por Status</div>
                                        </div>

                                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                                            <div className="text-center p-3 bg-background rounded-lg border">
                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                                                    <span className="text-xs font-medium text-zinc-600">Processando</span>
                                                </div>
                                                <div className="text-sm font-semibold text-zinc-900">{processingSettlements}</div>
                                            </div>

                                            <div className="text-center p-3 bg-background rounded-lg border">
                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                    <div className="h-2 w-2 rounded-full bg-orange-700" />
                                                    <span className="text-xs font-medium text-zinc-600">Pendente</span>
                                                </div>
                                                <div className="text-sm font-semibold text-zinc-900">{pendingSettlements}</div>
                                            </div>

                                            <div className="text-center p-3 bg-background rounded-lg border">
                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                                                    <span className="text-xs font-medium text-zinc-600">Pré-aprovado</span>
                                                </div>
                                                <div className="text-sm font-semibold text-zinc-900">{approvedSettlements}</div>
                                            </div>

                                            <div className="text-center p-3 bg-background rounded-lg border">
                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                                    <span className="text-xs font-medium text-zinc-600">Aprovado</span>
                                                </div>
                                                <div className="text-sm font-semibold text-zinc-900">{approvedSettlements}</div>
                                            </div>

                                            <div className="text-center p-3 bg-background rounded-lg border">
                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                    <div className="h-2 w-2 rounded-full bg-red-500" />
                                                    <span className="text-xs font-medium text-zinc-600">Erro</span>
                                                </div>
                                                <div className="text-sm font-semibold text-zinc-900">{errorSettlements}</div>
                                            </div>

                                            <div className="text-center p-3 bg-background rounded-lg border">
                                                <div className="flex items-center justify-center gap-2 mb-1">
                                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                                    <span className="text-xs font-medium text-zinc-600">Liquidadas</span>
                                                </div>
                                                <div className="text-sm font-semibold text-zinc-900">{processedSettlements}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Seção de Restituições */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Wallet className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-lg font-medium">Restituições</span>
                                    </div>

                                    <div className="grid gap-4">
                                        <div className="text-center p-4 bg-background rounded-lg border">
                                            <div className="text-2xl font-semibold text-zinc-900 mb-2">
                                                {formatCurrency(totalRestitutionAmount)}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Valor Total de Restituições</div>
                                        </div>

                                        <div className="text-center p-4 bg-background rounded-lg border">
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <div className="h-3 w-3 rounded-full bg-red-500" />
                                                <span className="text-sm font-medium text-zinc-600">Valor Total</span>
                                            </div>
                                            <div className="text-lg font-semibold text-zinc-900">
                                                {formatCurrency(totalRestitutionAmount)}
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
