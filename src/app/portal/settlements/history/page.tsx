import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import PaginationRecords from "@/components/pagination-Records";
import SettlementHistoryList from "../../../../features/settlements/_components/settlements-history-list";

import PageSizeSelector from "@/components/page-size-selector";
import { SettlementsHistoryDashboardContent } from "@/features/settlements/_components/settlements-history-dashboard-content";
import { SettlementsHistoryFilter } from "@/features/settlements/_components/settlements-history-filter";
import { getSettlements } from "@/features/settlements/server/settlements";

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
  const pageSize = parseInt(searchParams.pageSize || "10");
  const status = searchParams.status;
  const dateFrom = searchParams.dateFrom;
  const dateTo = searchParams.dateTo;

  // Buscar liquidações e totais de status
  const settlements = await getSettlements(
    status,
    dateFrom,
    dateTo,
    page,
    pageSize
  );

  const totalRecords = settlements.totalCount;

  const processingSettlements = settlements.statusCounts?.processing ?? 0;
  const errorSettlements = settlements.statusCounts?.error ?? 0;
  const processedSettlements = settlements.statusCounts?.settled ?? 0;
  const pendingSettlements = settlements.statusCounts?.pending ?? 0;
  const approvedSettlements = settlements.statusCounts?.approved ?? 0;
  const preApprovedSettlements = settlements.statusCounts?.preApproved ?? 0;

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
        //actions={<SyncButton syncType="settlement" />}
      >
        <div className="flex flex-col gap-4 mb-4">
          <div className="mb-2">
            <SettlementsHistoryFilter
              statusIn={status}
              dateFromIn={dateFrom ? new Date(dateFrom) : undefined}
              dateToIn={dateTo ? new Date(dateTo) : undefined}
            />
          </div>

          <div className="flex items-start justify-between gap-4 mb-2">
            <SettlementsHistoryDashboardContent
              totalSettlements={settlements.totalCount}
              totalGrossAmount={settlements.globalTotals.totalGrossAmount}
              totalRestitutionAmount={
                settlements.globalTotals.totalRestitutionAmount
              }
              totalNetAmount={settlements.globalTotals.totalNetAmount}
              pendingSettlements={pendingSettlements}
              approvedSettlements={approvedSettlements}
              processedSettlements={processedSettlements}
              processingSettlements={processingSettlements}
              errorSettlements={errorSettlements}
              preApprovedSettlements={preApprovedSettlements}
            />
          </div>
        </div>

        <SettlementHistoryList Settlements={settlements} />

        {totalRecords > 0 && (
          <div className="flex items-center justify-between mt-4">
            <PageSizeSelector
              currentPageSize={pageSize}
              pageName="portal/settlements/history"
            />
            <PaginationRecords
              totalRecords={totalRecords}
              currentPage={page}
              pageSize={pageSize}
              pageName="portal/settlements/history"
            />
          </div>
        )}
      </BaseBody>
    </>
  );
}
