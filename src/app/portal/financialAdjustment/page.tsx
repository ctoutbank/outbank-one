import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaginationWithSizeSelector from "@/components/pagination-with-size-selector";
import { Button } from "@/components/ui/button";
import { FinancialAdjustmentsDashboardContent } from "@/features/financialAdjustmet/_components/financial-adjustments-dashboard-content";
import { FinancialAdjustmentsFilter } from "@/features/financialAdjustmet/_components/financial-adjustments-filter";
import FinancialAdjustmentsList from "@/features/financialAdjustmet/_components/financial-adjustments-list";
import {
  getFinancialAdjustments,
  getFinancialAdjustmentStats,
} from "@/features/financialAdjustmet/server/financialAdjustments";
import { Plus } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

type FinancialAdjustmentsProps = {
  page?: string;
  pageSize?: string;
  search?: string;
  type?: string;
  reason?: string;
  active?: string;
};

export default async function FinancialAdjustmentsPage({
  searchParams,
}: {
  searchParams: FinancialAdjustmentsProps;
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "20");

  const adjustments = await getFinancialAdjustments(
    searchParams.search || "",
    page,
    pageSize,
    searchParams.type,
    searchParams.reason,
    searchParams.active
  );
  console.log(adjustments);
  const totalRecords = adjustments.totalCount;

  // Obter estatísticas para o dashboard
  const adjustmentStats = await getFinancialAdjustmentStats();

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Ajustes Financeiros", url: "/portal/financialAdjustment" },
        ]}
      />

      <BaseBody
        title="Ajustes Financeiros"
        subtitle={`Visualização de todos os Ajustes Financeiros`}
      >
        <div className="flex flex-col space-y-4">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex-1">
              <FinancialAdjustmentsFilter
                searchIn={searchParams.search}
                typeIn={searchParams.type}
                reasonIn={searchParams.reason}
                activeIn={searchParams.active}
              />
            </div>
            <Button asChild className="ml-2">
              <Link href="/portal/financialAdjustment/0">
                <Plus className="h-4 w-4 mr-1" />
                Novo Ajuste
              </Link>
            </Button>
          </div>

          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-grow">
              <FinancialAdjustmentsDashboardContent
                totalAdjustments={adjustmentStats.totalAdjustments}
                activeAdjustments={adjustmentStats.activeAdjustments}
                totalValue={adjustmentStats.totalValue}
                typeStats={adjustmentStats.typeStats}
                reasonStats={adjustmentStats.reasonStats}
              />
            </div>
          </div>

          <FinancialAdjustmentsList adjustments={adjustments} />
          {totalRecords > 0 && (
            <PaginationWithSizeSelector
              totalRecords={totalRecords}
              currentPage={page}
              pageSize={pageSize}
              pageName="portal/financialAdjustment"
            />
          )}
        </div>
      </BaseBody>
    </>
  );
}
