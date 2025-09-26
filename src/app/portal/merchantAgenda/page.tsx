import { PageHeader } from "@/components/layout/portal/PageHeader";
import { MerchantAgendaTabs } from "@/features/merchantAgenda/_components/merchantAgenda-tabs";
import type { SearchParams } from "@/features/merchantAgenda/_components/merchantAgenda-tabs";
import { getMerchantAgenda } from "@/features/merchantAgenda/server/merchantAgenda";
import {
  getMerchantAgendaAdjustment,
  getMerchantAgendaAdjustmentStats,
} from "@/features/merchantAgenda/server/merchantAgendaAdjustment";
import {
  getMerchantAgendaAnticipation,
  getMerchantAgendaAnticipationStats,
} from "@/features/merchantAgenda/server/merchantAgendaAntecipation";
import { checkPagePermission } from "@/lib/auth/check-permissions";

export const revalidate = 300;

export default async function MerchantAgendaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await checkPagePermission("Agenda Lojista");

  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "10");
  const search = searchParams.search || "";
  const transactionDateFrom = searchParams.transactionDateFrom || "";
  const transactionDateTo = searchParams.transactionDateTo || "";
  const establishmentIn = searchParams.establishment || undefined;
  const nsuIn = searchParams.nsu || undefined;
  const statusIn = searchParams.status || undefined;
  const orderIdIn = searchParams.orderId || undefined;

  const [
    merchantAgenda,
    merchantAgendaAnticipation,
    merchantAgendaAdjustment,
    anticipationDashboardStats,
    adjustmentDashboardStats,
  ] = await Promise.all([
    getMerchantAgenda(
      page,
      pageSize,
      searchParams.transactionDateFrom,
      searchParams.transactionDateTo,
      searchParams.establishment,
      searchParams.status,
      searchParams.cardBrand,
      searchParams.settlementDateFrom,
      searchParams.settlementDateTo,
      searchParams.expectedSettlementDateFrom,
      searchParams.expectedSettlementDateTo
    ),
    getMerchantAgendaAnticipation(
      search,
      page,
      pageSize,
      transactionDateFrom,
      transactionDateTo,
      establishmentIn,
      statusIn,
      searchParams.cardBrand,
      searchParams.settlementDateFrom,
      searchParams.settlementDateTo,
      searchParams.expectedSettlementDateFrom,
      searchParams.expectedSettlementDateTo,
      searchParams.saleDateFrom,
      searchParams.saleDateTo,
      nsuIn,
      orderIdIn
    ),
    getMerchantAgendaAdjustment(
      search,
      page,
      pageSize,
      transactionDateFrom,
      transactionDateTo,
      establishmentIn
    ),
    getMerchantAgendaAnticipationStats(
      transactionDateFrom,
      transactionDateTo,
      establishmentIn,
      statusIn,
      searchParams.cardBrand,
      searchParams.settlementDateFrom,
      searchParams.settlementDateTo,
      searchParams.saleDateFrom,
      searchParams.saleDateTo,
      nsuIn,
      orderIdIn
    ),
    getMerchantAgendaAdjustmentStats(
      transactionDateFrom,
      transactionDateTo,
      establishmentIn
    ),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Agenda dos Lojistas"
        description="Visualize sua agenda de pagamentos, antecipações e ajustes."
      />
      <MerchantAgendaTabs
        merchantAgendaTabsProps={{
          searchParams,
          merchantAgenda,
          merchantAgendaAnticipation,
          merchantAgendaAdjustment,
          anticipationDashboardStats,
          adjustmentDashboardStats,
        }}
      />
    </div>
  );
}