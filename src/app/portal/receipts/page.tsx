import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import MerchantAgendaReceipts from "@/features/merchantAgenda/_components/merchantAgendaReceipts";
import {
  DailyAmount,
  getMerchantAgendaReceipts,
  getGlobalSettlement,
} from "@/features/merchantAgenda/server/merchantAgenda";

export const revalidate = 0;

type ReceiptsProps = {
  page: string;
  pageSize: string;
  search: string;
  sortField?: string;
  sortOrder?: string;
};

export default async function ReceiptsPage({
  searchParams,
}: {
  searchParams: ReceiptsProps;
}) {
  const merchantAgendaReceipts = await getMerchantAgendaReceipts();
  const dailyAmounts: DailyAmount[] = merchantAgendaReceipts.map((receipt) => ({
    date: receipt.day as string,
    amount: receipt.totalAmount as number,
  }));
  const dailyData = await getGlobalSettlement();
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
