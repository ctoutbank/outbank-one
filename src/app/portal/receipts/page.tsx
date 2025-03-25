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
  search: string;
  date: string;
};

export default async function ReceiptsPage({
  searchParams,
}: {
  searchParams: ReceiptsProps;
}) {
  const currentDate = searchParams.date 
    ? new Date(searchParams.date) 
    : new Date();
    
  const merchantAgendaReceipts = await getMerchantAgendaReceipts(
    searchParams.search,
    currentDate
  );

  // Garante que os dados estão no formato correto para o calendário
  const dailyAmounts: DailyAmount[] = merchantAgendaReceipts.map((receipt) => {
    return {
      date: String(receipt.day),
      amount: Number(receipt.totalAmount) || 0,
    };
  }).filter(item => item.amount > 0); // Remove dias sem valores

  const dailyData = await getGlobalSettlement(
    searchParams.search,
    searchParams.date
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
