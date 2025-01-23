import ListFilter from "@/components/filter";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import PaginationRecords from "@/components/pagination-Records";
import MerchantSettlementsList from "../../../features/settlements/_components/settlements-list";

import { getMerchantSettlements } from "@/features/settlements/server/settlements";

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
  const totalRecords = merchantSettlements.totalCount;

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Liquidações", url: "/portal/settlements" },
        ]}
      />

      <BaseBody
        title="Liquidações"
        subtitle={`visualização de todas as Liquidações`}
      >
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
