"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, DollarSign, AlertCircle } from "lucide-react";

type TransactionsDashboardContentProps = {
  totalTransactions: number;
  approvedTransactions: number;
  pendingTransactions: number;
  rejectedTransactions: number;
  totalAmount: number;
  revenue: number;
};

export function TransactionsDashboardContent({
  totalTransactions,
  approvedTransactions,
  pendingTransactions,
  rejectedTransactions,
  totalAmount,
  revenue,
}: TransactionsDashboardContentProps) {
  return (
    <div className="w-full mt-4 mb-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Transactions Card */}
        <Card className="bg-white min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Total de Transações
                </span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900">
                {totalTransactions}
              </span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Aprovadas
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {approvedTransactions}
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Pendentes
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {pendingTransactions}
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Rejeitadas
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {rejectedTransactions}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Valores Card */}
        <Card className="bg-white min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Valores
                </span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalAmount)}
              </span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Valor Bruto
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totalAmount)}
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Receita
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(revenue)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ticket Médio Card */}
        <Card className="bg-white min-w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Ticket Médio
                </span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900">
                {totalTransactions > 0
                  ? new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(totalAmount / totalTransactions)
                  : "R$ 0,00"}
              </span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Aprovadas
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {approvedTransactions > 0
                    ? new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(totalAmount / approvedTransactions)
                    : "R$ 0,00"}
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Hoje
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(totalAmount * 0.12)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
