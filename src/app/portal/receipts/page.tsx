import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import MerchantAgendaReceipts from "@/features/merchantAgenda/_components/merchantAgendaReceipts";
import {
  DailyAmount,
  getGlobalSettlement,
  getMerchantAgendaReceipts,
} from "@/features/merchantAgenda/server/merchantAgenda";
import { checkPagePermission } from "@/lib/auth/check-permissions";

export const revalidate = 300;

type ReceiptsProps = {
  search?: string;
  date?: string;
};

export default async function ReceiptsPage({
  searchParams,
}: {
  searchParams: Promise<ReceiptsProps>;
}) {
  const resolvedSearchParams = await searchParams;
  const currentDate = resolvedSearchParams.date
    ? new Date(resolvedSearchParams.date)
    : new Date();

  await checkPagePermission("Agenda de Antecipações");
  console.log(resolvedSearchParams.search);
  const merchantAgendaReceipts = await getMerchantAgendaReceipts(
    resolvedSearchParams.search || null,
    currentDate
  );


  // Garante que os dados estão no formato correto para o calendário
  const dailyAmounts: DailyAmount[] = merchantAgendaReceipts
    .map((receipt) => {
      return {
        date: String(receipt.day),
        amount: Number(receipt.totalAmount) || 0,
        status: receipt.status,
        is_anticipation: receipt.is_anticipation,
      };
    })
    .filter((item) => item.amount > 0); // Remove dias sem valores

  const dailyData = await getGlobalSettlement(
    resolvedSearchParams.search || null,
    resolvedSearchParams.date || ""
  );

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Recebimentos", url: "/portal/receipts" }]}
      />

      <BaseBody
        title="Recebimentos"
        subtitle={`Visualização dos Recebimentos`}
        //actions={<SyncButton syncType="payout" />}
      >

          <MerchantAgendaReceipts
            monthlyData={dailyAmounts}
            dailyData={dailyData}
          />

      </BaseBody>
    </>
  );
}
