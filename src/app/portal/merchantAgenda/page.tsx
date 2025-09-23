import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
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

// Create TabChangeHandler in a separate file
import {
  MerchantAgendaTabs,
  SearchParams,
} from "@/features/merchantAgenda/_components/merchantAgenda- tabs";

export default async function MerchantAgendaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await checkPagePermission("Agenda Lojista");

  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1");
  const pageSize = parseInt(resolvedSearchParams.pageSize || "10");
  const search = resolvedSearchParams.search || "";
  const transactionDateFrom = resolvedSearchParams.transactionDateFrom || "";
  const transactionDateTo = resolvedSearchParams.transactionDateTo || "";
  const establishmentIn = resolvedSearchParams.establishment || undefined;
  const nsuIn = resolvedSearchParams.nsu || undefined;
  const statusIn = resolvedSearchParams.status || undefined;
  const orderIdIn = resolvedSearchParams.orderId || undefined;

  // Fetch data in parallel for better performance
  const [merchantAgenda, merchantAgendaAnticipation, merchantAgendaAdjustment] =
    await Promise.all([
      getMerchantAgenda(
        page,
        pageSize,
        resolvedSearchParams.transactionDateFrom,
        resolvedSearchParams.transactionDateTo,
        resolvedSearchParams.establishment,
        resolvedSearchParams.status,
        resolvedSearchParams.cardBrand,
        resolvedSearchParams.settlementDateFrom,
        resolvedSearchParams.settlementDateTo,
        resolvedSearchParams.expectedSettlementDateFrom,
        resolvedSearchParams.expectedSettlementDateTo
      ),
      getMerchantAgendaAnticipation(
        search,
        page,
        pageSize,
        transactionDateFrom,
        transactionDateTo,
        establishmentIn,
        statusIn,
        resolvedSearchParams.cardBrand,
        resolvedSearchParams.settlementDateFrom,
        resolvedSearchParams.settlementDateTo,
        resolvedSearchParams.expectedSettlementDateFrom,
        resolvedSearchParams.expectedSettlementDateTo,
        resolvedSearchParams.saleDateFrom,
        resolvedSearchParams.saleDateTo,
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
    ]);

  // Buscar dados para o dashboard
  const anticipationDashboardStats = await getMerchantAgendaAnticipationStats(
    transactionDateFrom,
    transactionDateTo,
    establishmentIn,
    statusIn,
    resolvedSearchParams.cardBrand,
    resolvedSearchParams.settlementDateFrom,
    resolvedSearchParams.settlementDateTo,
    resolvedSearchParams.saleDateFrom,
    resolvedSearchParams.saleDateTo,
    nsuIn,
    orderIdIn
  );

  // Buscar dados para o dashboard de ajustes
  const adjustmentDashboardStats = await getMerchantAgendaAdjustmentStats(
    transactionDateFrom,
    transactionDateTo,
    establishmentIn
  );

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Agenda dos Lojistas", url: "/portal/merchantAgenda" },
        ]}
      />

      <BaseBody
        title="Agenda dos Lojistas"
        subtitle={`Visualização da Agenda dos Lojistas`}
        className="overflow-x-visible"
      >
        <MerchantAgendaTabs
          merchantAgendaTabsProps={{
            searchParams: resolvedSearchParams,
            merchantAgenda: merchantAgenda,
            merchantAgendaAnticipation: merchantAgendaAnticipation,
            merchantAgendaAdjustment: merchantAgendaAdjustment,
            anticipationDashboardStats: anticipationDashboardStats,
            adjustmentDashboardStats: adjustmentDashboardStats,
          }}
        />
      </BaseBody>
    </>
  );
}
