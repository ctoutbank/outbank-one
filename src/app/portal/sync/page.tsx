import { PageHeader } from "@/components/layout/portal/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AsyncButtonsAntecipations from "./asyncButtonPauyoutAntecipation";
import AsyncButtonsCity from "./asynButtomCity";
import AsyncButtonsPage from "./asyncButtom";
import AsyncButtonsMerchantPrice from "./asyncButtomMerchantPrice";
import AsyncButtonsMerchantPriceGroup from "./asyncButtomMerchantPricegroup";
import AsyncButtonsPaymentLink from "./asyncButtonPaymentLink";
import AsyncButtonsPayout from "./asyncButtonPayouts";
import AsyncButtonsSettlement from "./asyncButtonSettlement";
import AsyncButtonsTransactions from "./asyncButtonTransactions";

export default function SyncPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Sincronização de Dados"
        description="Inicie manualmente os processos de sincronização do sistema."
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Merchant</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <AsyncButtonsPage />
            <AsyncButtonsMerchantPrice />
            <AsyncButtonsMerchantPriceGroup />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settlement and Payout</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <AsyncButtonsSettlement />
            <AsyncButtonsPayout />
            <AsyncButtonsAntecipations />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Link</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <AsyncButtonsPaymentLink />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>City</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <AsyncButtonsCity />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <AsyncButtonsTransactions />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}