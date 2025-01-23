import ListFilter from "@/components/filter";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import PaginationRecords from "@/components/pagination-Records";
import SettlementHistoryList from "../../../../features/settlements/_components/settlements-history-list";

import { getSettlements } from "@/features/settlements/server/settlements";
import FiltersHistory from "@/features/settlements/_components/filterSettlementsHistory";

export const revalidate = 0;

type HistoryProps = {
  page: string;
  pageSize: string;
  status: string;
  dateFrom: string;
  dateTo: string;
};

export default async function SettlementsPage({
  searchParams,
}: {
  searchParams: HistoryProps;
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "5");
  const status = searchParams.status;
  const dateFrom = searchParams.dateFrom;
  const dateTo = searchParams.dateTo;
  const settlements = await getSettlements(
    status,
    dateFrom,
    dateTo,
    page,
    pageSize
  );
  const totalRecords = settlements.totalCount;

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          {
            title: "Histórico de Liquidações",
            url: "/portal/settlements/history",
          },
        ]}
      />

      <BaseBody
        title="Histórico de Liquidações"
        subtitle={`Visualização do Histórico de Liquidações`}
      >
        <SettlementHistoryList Settlements={settlements} />
        {totalRecords > 0 && (
          <PaginationRecords
            totalRecords={totalRecords}
            currentPage={page}
            pageSize={pageSize}
            pageName="portal/settlements/history"
          ></PaginationRecords>
        )}
      </BaseBody>
    </>
  );
}
