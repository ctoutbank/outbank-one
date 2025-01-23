import ListFilter from "@/components/filter";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import PaginationRecords from "@/components/pagination-Records";
import SettlementHistoryList from "../../../../features/settlements/_components/settlements-history-list";

import { getSettlements } from "@/features/settlements/server/settlements";

export const revalidate = 0;

type CategoryProps = {
  page: string;
  pageSize: string;
  search: string;
};

export default async function SettlementsPage({
  searchParams,
}: {
  searchParams: CategoryProps;
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "5");
  const search = searchParams.search || "";
  const settlements = await getSettlements(search, page, pageSize);
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
        subtitle={`visualização do histórico de Liquidações`}
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
