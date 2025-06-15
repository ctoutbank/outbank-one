"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, DollarSign, FileText, TrendingUp } from "lucide-react";

interface FinancialAdjustmentsDashboardContentProps {
  totalAdjustments: number;
  activeAdjustments: number;
  totalValue: number;
  typeStats: { [key: string]: number };
  reasonStats: { [key: string]: number };
}

export function FinancialAdjustmentsDashboardContent({
  totalAdjustments,
  activeAdjustments,
  totalValue,
  typeStats,
  reasonStats,
}: FinancialAdjustmentsDashboardContentProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      CREDIT: "Crédito",
      DEBIT: "Débito",
      ADJUSTMENT: "Ajuste",
      REFUND: "Reembolso",
    };
    return labels[type] || type;
  };

  const getReasonLabel = (reason: string) => {
    const labels: { [key: string]: string } = {
      CHARGEBACK: "Chargeback",
      DISPUTE: "Disputa",
      REFUND: "Reembolso",
      FEE_ADJUSTMENT: "Ajuste de Taxa",
      TECHNICAL_ERROR: "Erro Técnico",
      OTHER: "Outros",
    };
    return labels[reason] || reason;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Ajustes
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAdjustments}</div>
          <p className="text-xs text-muted-foreground">
            Todos os ajustes cadastrados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ajustes Ativos</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeAdjustments}</div>
          <p className="text-xs text-muted-foreground">
            Ajustes atualmente ativos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          <p className="text-xs text-muted-foreground">
            Soma dos ajustes ativos
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Taxa de Ativação
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalAdjustments > 0
              ? Math.round((activeAdjustments / totalAdjustments) * 100)
              : 0}
            %
          </div>
          <p className="text-xs text-muted-foreground">
            Percentual de ajustes ativos
          </p>
        </CardContent>
      </Card>

      {/* Estatísticas por Tipo */}
      {Object.keys(typeStats).length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Distribuição por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(typeStats).map(([type, count]) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {getTypeLabel(type)}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas por Motivo */}
      {Object.keys(reasonStats).length > 0 && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Distribuição por Motivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(reasonStats).map(([reason, count]) => (
                <Badge key={reason} variant="secondary" className="text-xs">
                  {getReasonLabel(reason)}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
