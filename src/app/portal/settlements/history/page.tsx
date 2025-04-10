import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import PaginationRecords from "@/components/pagination-Records";
import SettlementHistoryList from "../../../../features/settlements/_components/settlements-history-list";

import { SettlementsHistoryDashboardButton } from "@/features/settlements/_components/settlements-history-dashboard-button";
import { SettlementsHistoryDashboardContent } from "@/features/settlements/_components/settlements-history-dashboard-content";
import { SettlementsHistoryFilter } from "@/features/settlements/_components/settlements-history-filter";
import { getSettlements } from "@/features/settlements/server/settlements";
import { SyncButton } from "@/features/sync/syncButton";

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
        actions={<SyncButton syncType="settlement" />}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4 flex-1">
            <SettlementsHistoryFilter
              statusIn={status}
              dateFromIn={dateFrom ? new Date(dateFrom) : undefined}
              dateToIn={dateTo ? new Date(dateTo) : undefined}
            />

            <SettlementsHistoryDashboardButton>
              <div className="-ml-28">
                <SettlementsHistoryDashboardContent
                  totalSettlements={settlements.totalCount}
                  totalGrossAmount={settlements.settlements.reduce(
                    (acc, curr) => acc + Number(curr.batch_amount),
                    0
                  )}
                  totalNetAmount={settlements.settlements.reduce(
                    (acc, curr) => acc + Number(curr.total_settlement_amount),
                    0
                  )}
                  totalRestitutionAmount={settlements.settlements.reduce(
                    (acc, curr) => acc + Number(curr.total_restitution_amount),
                    0
                  )}
                  pendingSettlements={
                    settlements.settlements.filter(
                      (s) => s.status === "pending"
                    ).length
                  }
                  approvedSettlements={
                    settlements.settlements.filter(
                      (s) => s.status === "approved"
                    ).length
                  }
                  processedSettlements={
                    settlements.settlements.filter(
                      (s) => s.status === "settled"
                    ).length
                  }
                />
              </div>
            </SettlementsHistoryDashboardButton>
          </div>
        </div>

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
