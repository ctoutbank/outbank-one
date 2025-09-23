import { EmptyState } from "@/components/empty-state";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaginationWithSizeSelector from "@/components/pagination-with-size-selector";
import { Button } from "@/components/ui/button";
import { ReportsDashboardContent } from "@/features/reports/_components/reports-dashboard-content";
import { ReportsFilter } from "@/features/reports/_components/reports-filter";
import ReportList from "@/features/reports/_components/reports-list";
import { getReports, getReportStats } from "@/features/reports/server/reports";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

export const revalidate = 300;

type ReportsProps = {
  page?: string;
  pageSize?: string;
  search?: string;
  type?: string;
  format?: string;
  recurrence?: string;
  period?: string;
  email?: string;
  creationDate?: string;
  sortBy?: string;
  sortOrder?: string;
};

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<ReportsProps>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1");
  const pageSize = parseInt(resolvedSearchParams.pageSize || "10");
  const sortBy = resolvedSearchParams.sortBy || "id";
  const sortOrder =
    resolvedSearchParams.sortOrder === "asc" || resolvedSearchParams.sortOrder === "desc"
      ? resolvedSearchParams.sortOrder
      : "desc";

  const reports = await getReports(
    resolvedSearchParams.search || "",
    page,
    pageSize,
    resolvedSearchParams.type,
    resolvedSearchParams.format,
    resolvedSearchParams.recurrence,
    resolvedSearchParams.period,
    resolvedSearchParams.email,
    resolvedSearchParams.creationDate,
    { sortBy, sortOrder }
  );
  const totalRecords = reports.totalCount;

  // Obter estatísticas para o dashboard
  const reportStats = await getReportStats();

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Relatórios", url: "/portal/reports" }]}
      />

      <BaseBody
        title="Relatórios"
        subtitle={`Visualização de todos os Relatórios`}
      >
        <div className="flex flex-col space-y-4">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex-1">
              <ReportsFilter
                searchIn={resolvedSearchParams.search}
                typeIn={resolvedSearchParams.type}
                formatIn={resolvedSearchParams.format}
                recurrenceIn={resolvedSearchParams.recurrence}
                periodIn={resolvedSearchParams.period}
                emailIn={resolvedSearchParams.email}
                creationDateIn={resolvedSearchParams.creationDate}
              />
            </div>
            <Button asChild className="ml-2">
              <Link href="/portal/reports/0">
                <Plus className="h-4 w-4 mr-1" />
                Novo Relatório
              </Link>
            </Button>
          </div>

          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-grow">
              <ReportsDashboardContent
                totalReports={reportStats.totalReports}
                recurrenceStats={reportStats.recurrenceStats}
                formatStats={reportStats.formatStats}
                typeStats={reportStats.typeStats}
              />
            </div>
          </div>

          {reports.reports.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nenhum resultado encontrado"
              description=""
            />
          ) : (
            <ReportList Reports={reports} />
          )}
          {totalRecords > 0 && (
            <PaginationWithSizeSelector
              totalRecords={totalRecords}
              currentPage={page}
              pageSize={pageSize}
              pageName="portal/reports"
            />
          )}
        </div>
      </BaseBody>
    </>
  );
}
