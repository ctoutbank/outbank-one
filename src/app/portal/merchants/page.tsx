import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaginationRecords from "@/components/pagination-Records";
import MerchantList from "../../../features/merchant/_components/merchant-list";
import FilterMerchants from "@/features/merchant/_components/filterMerchants";
import { getMerchants } from "@/features/merchant/server/merchant";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import MerchantOverview from "@/features/merchant/_components/merchant-overview";

type MerchantProps = {
  page?: string;
  pageSize?: string;
  search?: string;
  status?: string;
  state?: string;
  establishment?: string;
  dateFrom?: string;
  dateTo?: string;
}

export default async function MerchantsPage({
  searchParams,
}: {
  searchParams: MerchantProps;
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "12");
  const search = searchParams.search || "";
  const merchants = await getMerchants(
    search,
    page,
    pageSize,
    searchParams.establishment,
    searchParams.status,
    searchParams.state,
    searchParams.dateFrom,
    searchParams.dateTo
  );
  const totalRecords = merchants.totalCount;
  
  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Estabelecimentos", url: "/portal/merchants" }]}
      />

      <BaseBody
        title="Estabelecimentos"
        subtitle={`Visualização de todos os estabelecimentos`}
      >
        <div className="flex flex-col space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <FilterMerchants
                statusIn={searchParams.status}
                stateIn={searchParams.state}
                dateFromIn={searchParams.dateFrom ? new Date(searchParams.dateFrom) : undefined}
                dateToIn={searchParams.dateTo ? new Date(searchParams.dateTo) : undefined}
              />
              <MerchantOverview
                totalMerchants={merchants.totalCount}
                date={new Date()}
                activeMerchants={merchants.merchants.filter(m => m.active).length}
                inactiveMerchants={merchants.merchants.filter(m => !m.active).length}
                pendingKyc={merchants.merchants.filter(m => m.kic_status === "PENDING").length}
                approvedKyc={merchants.merchants.filter(m => m.kic_status === "APPROVED").length}
                rejectedKyc={merchants.merchants.filter(m => m.kic_status === "REJECTED").length}
                totalCpAnticipation={merchants.merchants.filter(m => !m.lockCpAnticipationOrder).length}
                totalCnpAnticipation={merchants.merchants.filter(m => !m.lockCnpAnticipationOrder).length}
              />
            </div>
            <Button asChild className="shrink-0">
              <Link href="/portal/merchants/0">
                <Plus className="h-4 w-4" />
                Novo Estabelecimento
              </Link>
            </Button>
          </div>
          <MerchantList list={merchants} />
          {totalRecords > 0 && (
            <PaginationRecords
              totalRecords={totalRecords}
              currentPage={page}
              pageSize={pageSize}
              pageName="portal/merchants"
            />
          )}
        </div>
      </BaseBody>
    </>
  );
}
