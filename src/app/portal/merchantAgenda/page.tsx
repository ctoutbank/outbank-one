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

  // Fetch data in parallel for better performance
  const [merchantAgenda, merchantAgendaAnticipation, merchantAgendaAdjustment] =
    await Promise.all([
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
    ]);

  // Buscar dados para o dashboard
  const anticipationDashboardStats = await getMerchantAgendaAnticipationStats(
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
            searchParams,
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
