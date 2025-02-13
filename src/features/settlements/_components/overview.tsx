import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";
import {
  formatCurrency,
  formatDateComplete,
  getStatusColor,
} from "@/lib/utils";

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
  return (
    <Card className="w-full border-l-8 border-black bg-sidebar">
      <div className="flex items-center justify-between">
        <CardHeader>
          <CardTitle className="text-xl font-bold ">Visão geral</CardTitle>
          <p className="text-sm text-muted-foreground">
            {formatDateComplete(financialOverviewProps.date)}
          </p>
        </CardHeader>
        <div className="flex gap-4 mt-4 mr-10">
          <Badge variant="outline" className="flex items-center gap-2 w-auto bg-white border">
            <Circle
              className={`w-3 h-3 stroke-none rounded-full ${getStatusColor(
                financialOverviewProps.creditStatus
              )}`}
            />
            Crédito
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2 w-auto bg-white border">
            <Circle
              className={`w-3 h-3 stroke-none rounded-full ${getStatusColor(
                financialOverviewProps.debitStatus
              )}`}
            />
            Débito
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2 w-auto bg-white border">
            <Circle
              className={`w-3 h-3 stroke-none rounded-full ${getStatusColor(
                financialOverviewProps.anticipationStatus
              )}`}
            />
            Antecipação
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2 w-auto bg-white border border-[#a7a7a7]">
            <Circle
              className={`w-3 h-3 stroke-none rounded-full ${getStatusColor(
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
            <Card className="p-4 space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Valor Líquido Recebíveis
                </p>
                <p className="text-xl font-semibold">
                  {formatCurrency(financialOverviewProps.grossSalesAmount)}
                </p>
              </div>
            </Card>
            <Card className="p-4 space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Valor Líquido Antecipação
                </p>
                <p className="text-xl font-semibold">
                  {formatCurrency(financialOverviewProps.netAnticipationsAmount)}
                </p>
              </div>
            </Card>
            <Card className="p-4 space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Valores de Retorno
                </p>
                <p className="text-xl font-semibold">
                  {formatCurrency(financialOverviewProps.restitutionAmount)}
                </p>
              </div>
            </Card>
            <Card className="p-4 space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Valor Total de Liquidação
                </p>
                <p className="text-xl font-semibold">
                  {formatCurrency(financialOverviewProps.settlementAmount)}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
