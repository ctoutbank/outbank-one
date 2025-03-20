import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaginationRecords from "@/components/pagination-Records";
import { Button } from "@/components/ui/button";
import { MerchantDashboardButton } from "@/features/merchant/_components/merchant-dashboard-button";
import { MerchantDashboardContent } from "@/features/merchant/_components/merchant-dashboard-content";
import { MerchantFilter } from "@/features/merchant/_components/merchant-filter";
import { getMerchants } from "@/features/merchant/server/merchant";
import { Plus } from "lucide-react";
import Link from "next/link";
import MerchantList from "../../../features/merchant/_components/merchant-list";
import { checkPagePermission } from "@/lib/auth/check-permissions";

export const revalidate = 0;

type MerchantProps = {
  page?: string;
  pageSize?: string;
  search?: string;
  status?: string;
  state?: string;
  establishment?: string;
};

export default async function MerchantsPage({
  searchParams,
}: {
  searchParams: MerchantProps;
}) {
  await checkPagePermission("Estabelecimentos");

  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "12");
  const search = searchParams.search || "";
  const merchants = await getMerchants(
    search,
    page,
    pageSize,
    searchParams.establishment,
    searchParams.status,
    searchParams.state
  );
  const totalRecords = merchants.totalCount;

  const merchantData = {
    totalMerchants: merchants.totalCount,
    activeMerchants: merchants.active_count || 0,
    inactiveMerchants: merchants.inactive_count || 0,
    pendingKyc: merchants.pending_kyc_count || 0,
    approvedKyc: merchants.approved_kyc_count || 0,
    rejectedKyc: merchants.rejected_kyc_count || 0,
    totalCpAnticipation: merchants.cp_anticipation_count || 0,
    totalCnpAnticipation: merchants.cnp_anticipation_count || 0,
  };

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Estabelecimentos", url: "/portal/merchants" },
        ]}
      />

      <BaseBody
        title="Estabelecimentos"
        subtitle={`Visualização de todos os estabelecimentos`}
      >
        <div className="flex flex-col space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <MerchantFilter
                establishmentIn={searchParams.establishment}
                statusIn={searchParams.status}
                stateIn={searchParams.state}
              />
              <MerchantDashboardButton>
                <div className="-ml-28">
                  <MerchantDashboardContent {...merchantData} />
                </div>
              </MerchantDashboardButton>
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
