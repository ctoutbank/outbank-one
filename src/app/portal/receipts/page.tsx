import { PageHeader } from "@/components/layout/portal/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MerchantAgendaReceipts from "@/features/merchantAgenda/_components/merchantAgendaReceipts";
import {
  type DailyAmount,
  getGlobalSettlement,
  getMerchantAgendaReceipts,
} from "@/features/merchantAgenda/server/merchantAgenda";
import { checkPagePermission } from "@/lib/auth/check-permissions";

export const revalidate = 300;

type ReceiptsProps = {
  searchParams: {
    search?: string;
    date?: string;
  };
};

export default async function ReceiptsPage({ searchParams }: ReceiptsProps) {
  await checkPagePermission("Agenda de Antecipações");

  const currentDate = searchParams.date ? new Date(searchParams.date) : new Date();

  const [merchantAgendaReceipts, dailyData] = await Promise.all([
    getMerchantAgendaReceipts(searchParams.search || null, currentDate),
    getGlobalSettlement(searchParams.search || null, searchParams.date || ""),
  ]);

  const dailyAmounts: DailyAmount[] = merchantAgendaReceipts
    .map((receipt) => ({
      date: String(receipt.day),
      amount: Number(receipt.totalAmount) || 0,
      status: receipt.status,
      is_anticipation: receipt.is_anticipation,
    }))
    .filter((item) => item.amount > 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Recebimentos"
        description="Acompanhe sua agenda de pagamentos futuros."
      />
      <Card>
        <CardHeader>
          <CardTitle>Agenda de Recebimentos</CardTitle>
          <CardDescription>
            Navegue pelo calendário para ver os valores programados para cada
            dia.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MerchantAgendaReceipts
            monthlyData={dailyAmounts}
            dailyData={dailyData}
          />
        </CardContent>
      </Card>
    </div>
  );
}