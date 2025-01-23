import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";
import { FormatCurrency, FormatDateComplete } from "@/lib/utils";

export type FinancialOverviewProps = {
  date: Date;
  grossSalesAmount: number;
  netAnticipationsAmount: number;
  restitutionAmount: number;
  settlementAmount: number;
  creditStatus: string;
  debitStatus: string;
  anticipationStatus: string;
  pixStatus: string;
};

export default function FinancialOverview({
  financialOverviewProps,
}: {
  financialOverviewProps: FinancialOverviewProps;
}) {
  function getStatusColor(status: string): string {
    switch (status) {
      case "PENDING":
        return "fill-yellow-500  ";
      case "PROCESSING":
        return "fill-yellow-300 ";
      case "REQUESTED":
        return "fill-yellow-300 ";
      case "FAILED":
        return "fill-red-500";
      case "SETTLED":
        return "fill-green-500  ";
      case "PRE_APPROVED":
        return "fill-blue-400  ";
      case "APPROVED":
        return "fill-blue-700  ";
      default:
        return "fill-gray-400 ";
    }
  }
  return (
    <Card className="w-full border-l-8 border-black ">
      <div className="flex items-center justify-between">
        <CardHeader>
          <CardTitle className="text-xl font-bold ">Visão geral</CardTitle>
          <p className="text-sm text-muted-foreground">
            {FormatDateComplete(financialOverviewProps.date)}
          </p>
        </CardHeader>
        <div className="flex gap-4 mt-4 mr-10">
          <Badge variant="outline" className="flex items-center gap-2 w-auto">
            <Circle
              className={`w-3 h-3 stroke-none ${getStatusColor(
                financialOverviewProps.creditStatus
              )}`}
            />
            Crédito
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2 w-auto">
            <Circle
              className={`w-3 h-3 stroke-none ${getStatusColor(
                financialOverviewProps.debitStatus
              )}`}
            />
            Débito
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2 w-auto">
            <Circle
              className={`w-3 h-3 stroke-none ${getStatusColor(
                financialOverviewProps.anticipationStatus
              )}`}
            />
            Antecipação
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2 w-auto">
            <Circle
              className={`w-3 h-3 stroke-none ${getStatusColor(
                financialOverviewProps.pixStatus
              )}`}
            />
            Pix
          </Badge>
        </div>
      </div>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Valor Líquido Recebíveis
              </p>
              <p className="text-lg font-semibold">
                {FormatCurrency(financialOverviewProps.grossSalesAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Valor Líquido Antecipação
              </p>
              <p className="text-lg font-semibold">
                {FormatCurrency(financialOverviewProps.netAnticipationsAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Valores de Retorno
              </p>
              <p className="text-lg font-semibold">
                {FormatCurrency(financialOverviewProps.restitutionAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Valor Total de Liquidação
              </p>
              <p className="text-lg font-semibold">
                {FormatCurrency(financialOverviewProps.settlementAmount)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
