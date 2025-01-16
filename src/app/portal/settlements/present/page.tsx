import ListFilter from "@/components/filter";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import PaginationRecords from "@/components/pagination-Records";
import SettlementList from "../../../../features/settlements/_components/settlements-list";

import { getMerchantSettlements } from "@/features/settlements/server/settlements";

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
  const settlements = await getMerchantSettlements(search, page, pageSize);
  const totalRecords = settlements.totalCount;

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Liquidações", url: "/portal/settlements/present" }]}
      />

      <BaseBody
        title="Liquidações"
        subtitle={`visualização de todos as Liquidações`}
      >
        <ListFilter pageName="portal/settlements/present" search={search} />

        <SettlementList MerchantSettlements={settlements} />
        {totalRecords > 0 && (
          <PaginationRecords
            totalRecords={totalRecords}
            currentPage={page}
            pageSize={pageSize}
            pageName="portal/settlements/present"
          ></PaginationRecords>
        )}
      </BaseBody>
    </>
  );
}
