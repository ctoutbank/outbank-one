import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import MerchantAgendaReceipts from "@/features/merchantAgenda/_components/merchantAgendaReceipts";
import {
  DailyAmount,
  getMerchantAgendaReceipts,
  getGlobalSettlement,
} from "@/features/merchantAgenda/server/merchantAgenda";
import { checkPagePermission } from "@/lib/auth/check-permissions";

export const revalidate = 0;

type ReceiptsProps = {
  search?: string;
  date?: string;
};

export default async function ReceiptsPage({
  searchParams,
}: {
  searchParams: ReceiptsProps;
}) {
  await checkPagePermission("Antecipações de Recebíveis");

  const merchantAgendaReceipts = await getMerchantAgendaReceipts(
    searchParams.search || null
  );
  const dailyAmounts: DailyAmount[] = merchantAgendaReceipts.map((receipt) => ({
    date: receipt.day as string,
    amount: receipt.totalAmount as number,
  }));
  const dailyData = await getGlobalSettlement(
    searchParams.search || null,
    searchParams.date || ""
  );
  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Recebimentos", url: "/portal/receipts" }]}
      />

      <BaseBody title="Recebimentos" subtitle={`visualização dos Recebimentos`}>
        <MerchantAgendaReceipts
          monthlyData={dailyAmounts}
          dailyData={dailyData}
        ></MerchantAgendaReceipts>
      </BaseBody>
    </>
  );
}
