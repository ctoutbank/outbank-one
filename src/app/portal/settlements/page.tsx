import ListFilter from "@/components/filter";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import PaginationRecords from "@/components/pagination-Records";
import MerchantSettlementsList from "../../../features/settlements/_components/settlements-list";

import {
  getMerchantSettlements,
  getSettlementBySlug,
} from "@/features/settlements/server/settlements";
import FinancialOverview from "@/features/settlements/_components/overview";

export const revalidate = 0;

type CategoryProps = {
  page: string;
  pageSize: string;
  search: string;
  settlementSlug: string;
};

export default async function SettlementsPage({
  searchParams,
}: {
  searchParams: CategoryProps;
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "5");
  const search = searchParams.search || "";
  const settlementSlug = searchParams.settlementSlug || "";
  const merchantSettlements = await getMerchantSettlements(
    search,
    page,
    pageSize,
    settlementSlug
  );
  const settlements = await getSettlementBySlug(settlementSlug);
  const totalRecords = merchantSettlements.totalCount;

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Liquidações", url: "/portal/settlements" }]}
      />

      <BaseBody
        title="Liquidações"
        subtitle={`Visualização de todas as Liquidações`}
      >
        <FinancialOverview
          financialOverviewProps={{
            date:
              new Date(settlements.settlement[0].payment_date || "") ||
              new Date(),
            grossSalesAmount: Number(
              settlements.settlement[0]?.batch_amount || 0
            ),
            netAnticipationsAmount: Number(
              settlements.settlement[0]?.total_anticipation_amount || 0
            ),
            restitutionAmount: Number(
              settlements.settlement[0]?.total_restituition_amount || 0
            ),
            settlementAmount: Number(
              settlements.settlement[0]?.total_settlement_amount || 0
            ),
            creditStatus: settlements.settlement[0].credit_status || "",
            debitStatus: settlements.settlement[0].debit_status || "",
            anticipationStatus:
              settlements.settlement[0].anticipation_status || "",
            pixStatus: settlements.settlement[0].pix_status || "",
          }}
        />
        <ListFilter pageName="portal/settlements" search={search} />

        <MerchantSettlementsList merchantSettlementList={merchantSettlements} />
        {totalRecords > 0 && (
          <PaginationRecords
            totalRecords={totalRecords}
            currentPage={page}
            pageSize={pageSize}
            pageName="portal/settlements"
          ></PaginationRecords>
        )}
      </BaseBody>
    </>
  );
}
