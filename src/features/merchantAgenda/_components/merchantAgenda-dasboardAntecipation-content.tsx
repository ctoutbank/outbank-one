"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import {
  Building2,
  Calendar,
  CircleDollarSign,
  ClipboardList,
  Tag,
} from "lucide-react";

type MerchantAgendaAnticipationsDashboardContentProps = {
  totalEstablishments: number;
  totalAnticipationRequests: number;
  totalParcels: number;
  fullyAnticipatedParcels: number;
  partiallyAnticipatedParcels: number;
  totalNetAnticipated: number;
  totalGrossAnticipated: number;
  totalAnticipationFees: number;
  firstTransactionDate?: string;
  lastTransactionDate?: string;
};

export function MerchantAgendaAnticipationsDashboardContent({
  totalEstablishments,
  totalAnticipationRequests,
  totalParcels,
  fullyAnticipatedParcels,
  partiallyAnticipatedParcels,
  totalNetAnticipated,
  totalGrossAnticipated,
  totalAnticipationFees,
  firstTransactionDate,
  lastTransactionDate,
}: MerchantAgendaAnticipationsDashboardContentProps) {
  // Formatação das datas de transação para exibição
  const formattedFirstDate = firstTransactionDate
    ? new Date(firstTransactionDate).toLocaleDateString("pt-BR")
    : "-";
  const formattedLastDate = lastTransactionDate
    ? new Date(lastTransactionDate).toLocaleDateString("pt-BR")
    : "-";

  const periodText = `${formattedFirstDate} - ${formattedLastDate}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center flex-wrap gap-4 ">
        {/* Período Card */}
        <Card className="bg-white min-w-[280px] w-4 h-[135px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Período
                </span>
              </div>
            </div>
            <Separator className="mb-3" />
            <div className="text-center">
              <span className="text-sm font-semibold text-zinc-900">
                {periodText}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Estabelecimentos Card */}
        <Card className="bg-white min-w-[280px] w-4 h-[135px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Estabelecimentos
                </span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900 ml-4">
                {totalEstablishments}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Pedidos de Antecipação Card */}
        <Card className="bg-white min-w-[280px] w-4 h-[135px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Pedidos de Antecipação
                </span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900 ml-4">
                {totalAnticipationRequests}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Parcelas Card */}
        <Card className="bg-white min-w-[280px] w-4 h-[135px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-medium text-zinc-600">
                  Parcelas
                </span>
              </div>
              <span className="text-2xl font-semibold text-zinc-900 ml-4">
                {totalParcels}
              </span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Totalmente
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {fullyAnticipatedParcels}
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Parcialmente
                  </span>
                </div>
                <span className="text-base font-semibold text-zinc-900">
                  {partiallyAnticipatedParcels}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Valores Financeiros Card */}
        <Card className="bg-white min-w-[280px] w-4 h-[135px]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4 text-zinc-500" />
                <span className="text-sm font-normal text-zinc-600">
                  Total Líquido Antecipado
                </span>
              </div>
              <span className="text-lg font-semibold text-zinc-900 ml-4 whitespace-nowrap">
                {formatCurrency(totalNetAnticipated)}
              </span>
            </div>
            <Separator className="mb-3" />
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Bruto
                  </span>
                </div>
                <span className="text-sm font-semibold text-zinc-900 whitespace-nowrap">
                  {formatCurrency(totalGrossAnticipated)}
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <span className="text-xs font-medium text-zinc-600">
                    Taxas
                  </span>
                </div>
                <span className="text-sm font-semibold text-zinc-900 whitespace-nowrap">
                  {formatCurrency(totalAnticipationFees)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
