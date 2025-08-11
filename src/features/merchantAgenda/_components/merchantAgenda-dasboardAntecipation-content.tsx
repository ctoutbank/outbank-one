"use client";

import { Card, CardContent } from "@/components/ui/card";
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
  settlementDateFrom?: string;
  settlementDateTo?: string;
  saleDateFrom?: string;
  saleDateTo?: string;
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
  settlementDateFrom,
  settlementDateTo,
  saleDateFrom,
  saleDateTo,
}: MerchantAgendaAnticipationsDashboardContentProps) {
  // Lógica para determinar qual período mostrar e qual label usar
  let periodText = "";
  let periodLabel = "Período";

  if (saleDateFrom || saleDateTo) {
    // Se filtrou por Data de Venda, mostra as datas do filtro
    periodLabel = "Período de Venda";
    const fromDate = saleDateFrom
      ? new Date(saleDateFrom).toLocaleDateString("pt-BR")
      : "";
    const toDate = saleDateTo
      ? new Date(saleDateTo).toLocaleDateString("pt-BR")
      : "";

    if (fromDate && toDate) {
      periodText = `${fromDate} - ${toDate}`;
    } else if (fromDate) {
      periodText = `A partir de ${fromDate}`;
    } else if (toDate) {
      periodText = `Até ${toDate}`;
    }
  } else if (settlementDateFrom || settlementDateTo) {
    // Se filtrou por Data de Liquidação, mostra as datas do filtro
    periodLabel = "Período de Liquidação";
    const fromDate = settlementDateFrom
      ? new Date(settlementDateFrom).toLocaleDateString("pt-BR")
      : "";
    const toDate = settlementDateTo
      ? new Date(settlementDateTo).toLocaleDateString("pt-BR")
      : "";

    if (fromDate && toDate) {
      periodText = `${fromDate} - ${toDate}`;
    } else if (fromDate) {
      periodText = `A partir de ${fromDate}`;
    } else if (toDate) {
      periodText = `Até ${toDate}`;
    }
  } else {
    // Se não há filtros de data específicos, usa as datas calculadas do banco
    periodLabel = "Período de Transações";
    const formattedFirstDate = firstTransactionDate
      ? new Date(firstTransactionDate).toLocaleDateString("pt-BR")
      : null;
    const formattedLastDate = lastTransactionDate
      ? new Date(lastTransactionDate).toLocaleDateString("pt-BR")
      : null;

    if (formattedFirstDate && formattedLastDate) {
      periodText = `${formattedFirstDate} - ${formattedLastDate}`;
    }
  }

  if (!periodText) {
    periodText = new Date().toLocaleDateString("pt-BR");
  }

  return (
    <div className="w-full">
      <div className="w-full mt-2">
        <Card className="w-full border-none bg-transparent">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
              {/* Card de Período */}
              <Card className="bg-transparent border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-base font-medium">{periodLabel}</span>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-semibold text-zinc-900">
                      {periodText}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card de Estabelecimentos */}
              <Card className="bg-transparent border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-base font-medium">
                      Estabelecimentos
                    </span>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-zinc-900">
                      {totalEstablishments}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Total de Estabelecimentos
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card de Pedidos de Antecipação */}
              <Card className="bg-transparent border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Pedidos de Antecipação
                    </span>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-zinc-900">
                      {totalAnticipationRequests}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Total de Pedidos
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card de Parcelas */}
              <Card className="bg-transparent border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-base font-medium">Parcelas</span>
                  </div>

                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-zinc-900">
                      {totalParcels}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Total de Parcelas
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-zinc-600">
                          Totalmente
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-zinc-900">
                        {fullyAnticipatedParcels}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                        <span className="text-xs font-medium text-zinc-600">
                          Parcialmente
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-zinc-900">
                        {partiallyAnticipatedParcels}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card de Valores Financeiros */}
              <Card className="bg-transparent border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      Total Líquido Antecipado
                    </span>
                  </div>

                  <div className="text-center mb-4">
                    <div className="text-xl font-bold text-zinc-900">
                      {formatCurrency(totalNetAnticipated)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Valor Líquido
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-zinc-600">
                          Bruto
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-zinc-900">
                        {formatCurrency(totalGrossAnticipated)}
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
                        {formatCurrency(totalAnticipationFees)}
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
